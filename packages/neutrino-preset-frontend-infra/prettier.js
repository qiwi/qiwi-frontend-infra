const loaderMerge = require('@neutrinojs/loader-merge')
const merge = require('deepmerge')

module.exports = (neutrino, opts = {}) => {
  const defaults = {
    bracketSpacing: false,
    singleQuote: true,
    jsxBracketSameLine: false,
    trailingComma: 'es5',
    printWidth: 95,
    semi: false,
  }
  const options = merge(defaults, opts)

  neutrino.config.when(neutrino.config.module.rules.has('lint'), () =>
    neutrino.use(loaderMerge('lint', 'eslint'), {
      baseConfig: {
        extends: ['prettier'],
      },
      plugins: ['prettier'],
      rules: {
        'prettier/prettier': ['error', options],

        'comma-dangle': 'off',
      },
    })
  )

  neutrino.register(
    'prettierrc',
    () => options,
    'Return an object of accumulated Prettier configuration suitable for use by .prettierrc.js'
  )
}
