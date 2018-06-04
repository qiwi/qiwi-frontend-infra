const loaderMerge = require('@neutrinojs/loader-merge')
const lint = require('./base')

module.exports = (neutrino, options) => {
  neutrino.use(lint, {
    envs: ['node'],
    parserOptions: {
      sourceType: 'script',
    },
    rules: {
      'node/no-unsupported-features': 'error',

      'template-curly-spacing': ['error', 'never'],
      'prefer-arrow-callback': 'error',
      'no-dupe-class-members': 'error',
      'no-this-before-super': 'error',
      'constructor-super': 'error',
      'object-shorthand': 'error',
      'no-const-assign': 'error',
      'no-new-symbol': 'error',
      'require-yield': 'error',
      'arrow-spacing': 'error',
      'arrow-parens': ['error', 'as-needed'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  })

  if (options) {
    neutrino.use(loaderMerge('lint', 'eslint'), options)
  }
}
