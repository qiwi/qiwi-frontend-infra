const { DuplicateRuleError } = require('neutrino/errors')
const styleLoader = require('@neutrinojs/style-loader')
const merge = require('deepmerge')

module.exports = (neutrino, opts = {}) => {
  const options = merge(
    {
      test: neutrino.regexFromExtensions(['less']),
      ruleId: 'less',
      loaders: [],
      less: {}
    },
    opts
  )

  if (neutrino.config.module.rules.has(options.ruleId)) {
    throw new DuplicateRuleError('@qiwi/neutrino-less-loader', options.ruleId)
  }

  options.loaders.push({
    loader: require.resolve('less-loader'),
    options: options.less,
    useId: 'less'
  })

  neutrino.use(styleLoader, options)
}
