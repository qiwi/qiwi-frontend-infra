const lint = require('@neutrinojs/eslint')
const { merge: eslintMerge } = require('eslint/lib/config/config-ops')
const eslint = require('./eslint')

module.exports = (neutrino, opts = {}) => {
  const base = eslint()
  const nodeConfig = {
    baseConfig: {
      parserOptions: {
        sourceType: 'script'
      },
      rules: {
        'require-atomic-updates': 'error',
        'prefer-arrow-callback': 'error',
        'prefer-rest-params': 'error',
        'object-shorthand': 'error',
        'require-yield': 'error',
        'no-var': 'error',
        // Node plugin
        'node/no-unsupported-features/node-builtins': 'error',
        'node/no-unsupported-features/es-builtins': 'error',
        'node/no-unsupported-features/es-syntax': 'error'
      }
    }
  }
  const defaults = eslintMerge(base.eslint, nodeConfig)
  const options = {
    ...base,
    ...opts,
    eslint: eslintMerge(defaults, opts.eslint || {})
  }

  neutrino.use(lint, options)
}
