const { basename, join, relative } = require('path')
const {
  ensureDirSync,
  readJsonSync,
  writeJsonSync,
  pathExistsSync,
  removeSync
} = require('fs-extra')
const chalk = require('chalk')
const stringify = require('javascript-stringify')
const merge = require('deepmerge')
const Generator = require('yeoman-generator')
const questions = require('./questions')
const { packages, presets, neutrinoVersion } = require('./matrix')
const { isYarn } = require('./utils')
const packageManager = isYarn ? 'yarn' : 'npm'

module.exports = class Project extends Generator {
  static _logo() {
    return chalk.keyword('orange').bold(`
    ________  .__        .__
    \\_____  \\ |__|_  _  _|__|
     /  / \\  \\|  \\ \\/ \\/ /  |
    /   \\_/.  \\  |\\     /|  |
    \\_____\\ \\_/__| \\/\\_/ |__|
           \\__>
    `)
  }

  static _processDependencies(dependencies) {
    return dependencies
      .map(dependency =>
        /^(@neutrinojs|neutrino)/i.test(dependency)
          ? `${dependency}@^${neutrinoVersion}`
          : dependency
      )
      .sort()
  }

  _spawnSync(command, args) {
    const result = this.spawnCommandSync(command, args, {
      cwd: this.options.directory,
      stdio: this.options.stdio,
      env: process.env
    })

    if (result.error || result.status !== 0) {
      const commandString = [command, ...args].join(' ')

      if (result.error) {
        // The child process failed to start entirely, or timed out.
        this.log.error(result.error)
      }

      this.log.error(`The command "${commandString}" exited unsuccessfully.`)

      if (!this.options.debug) {
        this.log.error('Cleaning up the incomplete project directory.')
        removeSync(this.options.directory)
        this.log.error(
          'Try again with the --debug flag for more information and to skip cleanup.'
        )
      }

      process.exit(result.status || 1)
    }

    return result
  }

  _getLinterPreset() {
    const { project, linter } = this.data

    if ([packages.REACT, packages.REACT_COMPONENTS].includes(project)) {
      return `${linter}/react`
    }

    return `${linter}/node`
  }

  _getProjectMiddleware() {
    const { projectType, project } = this.data

    if (projectType === 'application' && project !== packages.NODE) {
      return [
        project,
        {
          html: {
            title: this.options.name
          }
        }
      ]
    } else if (projectType === 'library') {
      return [
        project,
        {
          name: this.options.name
        }
      ]
    }

    return project
  }

  _getNeutrinorcContent() {
    // We need to output the word __dirname literally in the file, not its
    // evaluated value, so we string-build to ensure this is pulled at run-time
    // and not create-time.
    const options = '{\n  options: {\n    root: __dirname,\n  },'
    const rc = {
      use: [
        this._getLinterPreset(),
        this._getProjectMiddleware(),
        this.data.testRunner
      ].filter(Boolean)
    }

    return `module.exports = ${options}${stringify(rc, null, 2).slice(1)};\n`
  }

  _getDependencies() {
    const { dependencies, devDependencies } = [
      this.data.project,
      this.data.testRunner,
      this.data.linter,
      this.data.hooks
    ].reduce((deps, preset) => merge(deps, presets[preset] || {}), {
      dependencies: [],
      devDependencies: []
    })

    return {
      dependencies: Project._processDependencies(dependencies),
      devDependencies: Project._processDependencies(devDependencies)
    }
  }

  _initialPackageJson() {
    const { project, projectType, testRunner, linter } = this.data
    const scripts = { build: 'webpack --mode production' }
    let lintDirectories = 'src'

    if (projectType !== 'library') {
      scripts.start =
        project === packages.NODE
          ? 'webpack --watch --mode development'
          : 'webpack-dev-server --mode development --open'
    }

    if (testRunner) {
      if (testRunner.includes('jest')) {
        scripts.test = 'jest'
      } else if (testRunner.includes('mocha')) {
        scripts.test = 'mocha --require mocha.config.js --recursive'
      }

      lintDirectories += ' test'
    }

    if (linter) {
      scripts.lint = `eslint --cache --format codeframe --ext mjs,jsx,js ${lintDirectories}`
    }

    this._spawnSync(packageManager, ['init', '--yes'])

    const jsonPath = join(this.options.directory, 'package.json')
    const json = readJsonSync(jsonPath)
    const packageJson = { ...json, scripts }

    writeJsonSync(jsonPath, packageJson, { spaces: 2 })
    this.log(
      `   ${chalk.green('create')} ${join(basename(this.options.directory), 'package.json')}`
    )
  }

  prompting() {
    const done = this.async()

    this.log(Project._logo())
    this.log(chalk.white.bold('Welcome to QIWI! 👋'))
    this.log(
      chalk.cyan(
        'To help you create your new project, I am going to ask you a few questions.\n'
      )
    )

    this.prompt(questions())
      .then(answers => {
        this.data = answers
      })
      .then(() => {
        this.log(
          `\n👌  ${chalk.white.bold(
            'Looks like I have all the info I need. Give me a moment while I create your project!'
          )}\n`
        )
        done()
      })
  }

  writing() {
    if (pathExistsSync(this.options.directory)) {
      this.log.error(
        `The directory ${this.options.directory} already exists. ` +
          'For safety, please use create-project with a non-existent directory.'
      )
      process.exit(1)
    }

    ensureDirSync(this.options.directory)

    const templates = [
      'common',
      this.data.project,
      this.data.testRunner,
      this.data.linter,
      this.data.hooks
    ].filter(Boolean)

    this._initialPackageJson()
    this.fs.write(join(this.options.directory, '.neutrinorc.js'), this._getNeutrinorcContent())
    templates.forEach(template => {
      const templateDir = template.replace(/@neutrinojs\/|@qiwi\//, '')

      this.fs.copyTpl(
        this.templatePath(`${templateDir}/**`),
        this.options.directory,
        { data: { ...this.options, packageManager } },
        {},
        { globOptions: { dot: true } }
      )
    })
  }

  install() {
    const install = isYarn ? 'add' : 'install'
    const devFlag = isYarn ? '--dev' : '--save-dev'
    const { dependencies, devDependencies } = this._getDependencies()

    this.log('')

    if (dependencies.length) {
      this.log(
        `${chalk.green('⏳  Installing dependencies:')} ${chalk.yellow(
          dependencies.join(', ')
        )}`
      )
      this._spawnSync(packageManager, [
        install,
        ...(this.options.registry ? ['--registry', this.options.registry] : []),
        ...dependencies
      ])
    }

    if (devDependencies.length) {
      this.log(
        `${chalk.green('⏳  Installing devDependencies:')} ${chalk.yellow(
          devDependencies.join(', ')
        )}`
      )
      this._spawnSync(packageManager, [
        install,
        devFlag,
        ...(this.options.registry ? ['--registry', this.options.registry] : []),
        ...devDependencies
      ])
    }

    if (this.data.linter) {
      this.log(`${chalk.green('⏳  Performing one-time lint')}`)
      this._spawnSync(
        packageManager,
        isYarn ? ['lint', '--fix'] : ['run', 'lint', '--', '--fix']
      )
    }
  }

  end() {
    this.log(`\n${chalk.green('Hooray, I successfully created your project!')}`)
    this.log(
      `\nI have added a few ${isYarn ? 'yarn' : 'npm'} scripts to help you get started:`
    )
    this.log(
      `  • To build your project run:  ${chalk.cyan.bold(
        `${isYarn ? 'yarn' : 'npm run'} build`
      )}`
    )

    if (this.data.projectType !== 'library') {
      this.log(
        `  • To start your project locally run:  ${chalk.cyan.bold(`${packageManager} start`)}`
      )
    }

    if (this.data.testRunner) {
      this.log(`  • To execute tests run:  ${chalk.cyan.bold(`${packageManager} test`)}`)
    }

    if (this.data.linter) {
      const lintCommand = isYarn ? 'yarn lint' : 'npm run lint'
      const fixLintCommand = isYarn ? `${lintCommand} --fix` : `${lintCommand} -- --fix`

      this.log(`  • To lint your project manually run:  ${chalk.cyan.bold(lintCommand)}`)
      this.log(
        `    You can also fix linting problems with:  ${chalk.cyan.bold(fixLintCommand)}`
      )
    }

    this.log('\nNow change your directory to the following to get started:')
    this.log(
      `  ${chalk.cyan('cd')} ${chalk.cyan(relative(process.cwd(), this.options.directory))}`
    )
    this.log(`\n❤️  ${chalk.white.bold('QIWI')}`)
  }
}
