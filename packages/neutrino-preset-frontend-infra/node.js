const nodePreset = require('@neutrinojs/node')

const nodeLint = require('./lint/node')
const prettier = require('./prettier')
const decorators = require('./decorators')
const devtool = require('./devtool')
const localModules = require('./local-modules')
const stage = require('./stage')
const alias = require('./alias')

module.exports = (neutrino, options = {}) => {
  neutrino.use(nodePreset, options)
  neutrino.use(nodeLint, options.eslint)
  neutrino.use(prettier)
  neutrino.use(decorators)
  neutrino.use(devtool)
  neutrino.use(localModules)
  neutrino.use(stage, options.staging)
  neutrino.use(alias, options.alias)
}
