const reactPreset = require('@neutrinojs/react')

const reactLint = require('./lint/react')
const prettier = require('./prettier')
const decorators = require('./decorators')
const rhl = require('./rhl')
const devtool = require('./devtool')
const localModules = require('./local-modules')
const stage = require('./stage')
const alias = require('./alias')

module.exports = (neutrino, options = {}) => {
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
