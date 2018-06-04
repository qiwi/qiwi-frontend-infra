const {basename, join, relative} = require('path')
const {ensureDirSync, readJsonSync, writeJsonSync} = require('fs-extra')
const chalk = require('chalk')
const stringify = require('javascript-stringify')
const merge = require('deepmerge')
const {contains, partition} = require('ramda')
const Generator = require('yeoman-generator')

const questions = require('./questions')
const {projects, packages, isYarn} = require('./utils')

/* eslint-disable no-underscore-dangle */
module.exports = class Project extends Generator {
  static _logo () {
    return chalk.keyword('orange').bold(`
    ________  .__        .__ 
    \\_____  \\ |__|_  _  _|__|
     /  / \\  \\|  \\ \\/ \\/ /  |
    /   \\_/.  \\  |\\     /|  |
    \\_____\\ \\_/__| \\/\\_/ |__|
           \\__>              
    `)
  }

  _getProjectMiddleware () {
    const {projectType, project} = this.data

    if (projectType === 'application' && project !== packages.NODE) {
      return [project, {
        html: {
          title: this.options.name,
        },
      }]
    } else if (projectType === 'library') {
      return [project, {
        name: this.options.name,
      }]
    }

    return project
  }

  _getNeutrinorcContent () {
    const rc = {
      use: [
        this.data.testRunner,
        projects[this.data.project].linter,
        this._getProjectMiddleware(),
      ].filter(Boolean),
    }

    return `module.exports = ${stringify(rc, null, 2)};\n`
  }

  _getDependencies () {
    const {dependencies, devDependencies} = [
      this.data.project,
      this.data.testRunner,
    ].reduce(
      (deps, project) => merge(deps, projects[project] || {}),
      {dependencies: [], devDependencies: []}
    )

    if (dependencies.length && devDependencies.length) {
      return {dependencies, devDependencies}
    } else if (dependencies.length) {
      return {dependencies}
    } else if (devDependencies.length) {
      return {devDependencies}
    }

    return {}
  }

  _initialPackageJson () {
    const installer = isYarn ? 'yarn' : 'npm'
    const scripts = {
      build: `${packages.NEUTRINO} build`,
      lint: `${packages.NEUTRINO} lint`,
    }

    if (this.data.projectType !== 'library') {
      scripts.start = `${packages.NEUTRINO} start`
    }

    if (this.data.testRunner) {
      scripts.test = `${packages.NEUTRINO} test`
    }

    ensureDirSync(this.options.directory)

    this.spawnCommandSync(installer, ['init', '--yes'], {
      cwd: this.options.directory,
      stdio: this.options.stdio,
    })

    const jsonPath = join(this.options.directory, 'package.json')
    const json = readJsonSync(jsonPath)
    const packageJson = {...json, scripts}

    writeJsonSync(jsonPath, packageJson, {spaces: 2})
    this.log(`   ${chalk.green('create')} ${join(basename(this.options.directory), 'package.json')}`)
  }

  prompting () {
    const done = this.async()

    this.log(Project._logo())
    this.log(chalk.white.bold('Welcome to QIWI! 👋'))
    this.log(chalk.cyan('To help you create your new project, I am going to ask you a few questions.\n'))

    this
      .prompt(questions())
      .then(answers => { this.data = answers })
      .then(() => {
        this.log(`\n👌  ${chalk.white.bold('Looks like I have all the info I need. Give me a moment while I create your project!')}\n`)
        done()
      })
  }

  writing () {
    const templates = ['common', this.data.project, this.data.testRunner].filter(Boolean)

    this._initialPackageJson()
    this.fs.write(
      join(this.options.directory, '.neutrinorc.js'),
      this._getNeutrinorcContent()
    )
    templates.forEach(template => {
      const templateDir = template.replace(/@neutrinojs\/|@qiwi\/neutrino-preset-frontend-infra\//, '')

      this.fs.copyTpl(
        this.templatePath(`${templateDir}/**`),
        this.options.directory,
        {data: this.options},
        {},
        {globOptions: {dot: true}}
      )
    })
  }

  install () {
    const packageManager = isYarn ? 'yarn' : 'npm'
    const install = isYarn ? 'add' : 'install'
    const devFlag = isYarn ? '--dev' : '--save-dev'
    const {dependencies, devDependencies} = this._getDependencies()
    const sortedDependencies = dependencies && dependencies.sort()
    const sortedDevDependencies = devDependencies && devDependencies.sort()

    this.log('')

    if (dependencies) {
      this.log(`${chalk.green('⏳  Installing dependencies:')} ${chalk.yellow(sortedDependencies.join(', '))}`)
      this.spawnCommandSync(
        packageManager,
        [
          install,
          ...(this.options.registry ? ['--registry', this.options.registry] : []),
          ...sortedDependencies,
        ],
        {
          cwd: this.options.directory,
          stdio: this.options.stdio,
          env: process.env,
        })
    }

    if (devDependencies) {
      if (process.env.NODE_ENV === 'test') {
        const [local, remote] = partition(
          contains(packages.NEUTRINO),
          devDependencies,
        )

        if (remote.length) {
          this.log(`${chalk.green('⏳  Installing remote devDependencies:')} ${chalk.yellow(remote.join(', '))}`)
          this.spawnCommandSync(packageManager, [install, devFlag, ...remote], {
            cwd: this.options.directory,
            stdio: this.options.stdio,
            env: process.env,
          })
        }

        if (local.length) {
          this.log(`${chalk.green('⏳  Linking local devDependencies:')} ${chalk.yellow(local.join(', '))}`)
          this.spawnCommandSync('yarn', ['link', ...local], {
            cwd: this.options.directory,
            stdio: this.options.stdio,
            env: process.env,
          })
        }
      } else {
        this.log(`${chalk.green('⏳  Installing devDependencies:')} ${chalk.yellow(sortedDevDependencies.join(', '))}`)
        this.spawnCommandSync(
          packageManager,
          [
            install,
            devFlag,
            ...(this.options.registry ? ['--registry', this.options.registry] : []),
            ...sortedDevDependencies,
          ],
          {
            cwd: this.options.directory,
            stdio: this.options.stdio,
            env: process.env,
          }
        )
      }
    }
  }

  end () {
    this.log(`\n${chalk.green('Hooray, I successfully created your project!')}`)
    this.log(`\nI have added a few ${isYarn ? 'yarn' : 'npm'} scripts to help you get started:`)
    this.log(`  • To build your project run:  ${chalk.cyan.bold(`${isYarn ? 'yarn' : 'npm run'} build`)}`)

    if (this.data.projectType !== 'library') {
      this.log(`  • To start your project locally run:  ${chalk.cyan.bold(`${isYarn ? 'yarn' : 'npm'} start`)}`)
    }

    if (this.data.testRunner) {
      this.log(`  • To execute tests run:  ${chalk.cyan.bold(`${isYarn ? 'yarn' : 'npm'} test`)}`)
    }

    this.log(`  • To lint your project manually run:  ${chalk.cyan.bold(`${isYarn ? 'yarn' : 'npm run'} lint`)}`)
    this.log(`    You can also fix some linting problems with:  ${chalk.cyan.bold(`${isYarn ? 'yarn' : 'npm run'} lint --fix`)}`)

    this.log('\nNow change your directory to the following to get started:')
    this.log(`  ${chalk.cyan('cd')} ${chalk.cyan(relative(process.cwd(), this.options.directory))}`)
    this.log(`\n❤️  ${chalk.white.bold('QIWI')}`)
  }
}
