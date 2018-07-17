const reactPreset = require('@neutrinojs/react')
const htmlTemplate = require('@qiwi/html-webpack-template')
const merge = require('deepmerge')

const reactLint = require('./lint/react')
const prettier = require('./prettier')
const decorators = require('./decorators')
const rhl = require('./rhl')
const devtool = require('./devtool')
const localModules = require('./local-modules')
const stage = require('./stage')
const alias = require('./alias')

module.exports = (neutrino, opts) => {
  const defaults = {
    html: {
      template: htmlTemplate,
    },
  }
  const options = merge(defaults, opts)

  neutrino.use(reactPreset, options)
  neutrino.use(reactLint, options.eslint)
  neutrino.use(prettier)
  neutrino.use(decorators)
  neutrino.use(rhl)
  neutrino.use(devtool)
  neutrino.use(localModules)
  neutrino.use(stage, options.staging)
  neutrino.use(alias, options.alias)
}
