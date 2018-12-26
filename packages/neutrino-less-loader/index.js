const styleLoader = require('@neutrinojs/style-loader')
const merge = require('deepmerge')

module.exports = (neutrino, opts = {}) => {
  const options = merge(
    {
      test: neutrino.regexFromExtensions(['less']),
      ruleId: 'less',
      extract: process.env.NODE_ENV === 'production',
      loaders: [],
      less: {}
    },
    opts
  )

  Object.assign(options, {
    extract: options.extract === true ? {} : options.extract
  })

  options.loaders.push({
    loader: require.resolve('less-loader'),
    options: options.less
  })

  neutrino.use(styleLoader, options)
}
