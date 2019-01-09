module.exports = (neutrino, options) => {
  neutrino.use(null, {
    eslint: {
      emitWarning: process.env.NODE_ENV === 'development',
      baseConfig: {
        extends: ['standard']
      },
      plugins: ['security', 'node'],
      rules: {
        // standard plugin
        'standard/no-callback-literal': 'off',

        // secure plugin
        'security/detect-possible-timing-attacks': 'error',
        'security/detect-eval-with-expression': 'error',
        'security/detect-non-literal-require': 'error',
        'security/detect-non-literal-regexp': 'error',
        'security/detect-pseudoRandomBytes': 'error',
        'security/detect-buffer-noassert': 'error',
        'security/detect-unsafe-regex': 'error',
        'security/detect-new-buffer': 'error',

        // node plugin
        'node/no-unpublished-require': 'error',
        'node/no-extraneous-require': 'error',
        'node/no-missing-require': 'error',

        // import plugin
        'import/order': ['error', { 'newlines-between': 'ignore' }],

        'nonblock-statement-body-position': 'error',
        'computed-property-spacing': ['error', 'never'],
        'array-bracket-spacing': ['error', 'never'],
        'object-curly-spacing': ['error', 'never'],
        'func-name-matching': 'error',
        'no-useless-return': 'error',
        'consistent-return': 'error',
        'no-nested-ternary': 'error',
        'block-scoped-var': 'error',
        'global-require': 'error',
        'no-unused-vars': ['error', { vars: 'all', args: 'after-used' }],
        'getter-return': 'error',
        'for-direction': 'error',
        'no-lonely-if': 'error',
        'valid-jsdoc': 'error',
        'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
        'no-shadow': 'error',
        'max-len': [
          'error',
          95,
          2,
          {
            ignoreUrls: true,
            ignoreComments: false,
            ignoreStrings: true,
            ignoreTemplateLiterals: true
          }
        ],
        'no-new': 'off',

        'prefer-const': 'error',
        'comma-dangle': ['error', 'always-multiline']
      }
    }
  })
}

// TODO: add lint for test
// {
//   files: ['test/*.js'],
//   rules: {
//     'node/no-unpublished-require': 'off',
//   },
//   globals: jest,
// },
// {
//   files: ['*.test.js'],
//   rules: {
//     'jest/valid-expect-in-promise': 'error',
//     'jest/prefer-to-be-undefined': 'error',
//     'jest/prefer-to-have-length': 'error',
//     'jest/no-identical-title': 'error',
//     'jest/consistent-test-it': ['error', {fn: 'it'}],
//     'jest/no-disabled-tests': 'error',
//     'jest/prefer-to-be-null': 'error',
//     'jest/no-focused-tests': 'error',
//     'jest/valid-expect': 'error',
//   },
//   globals: jest,
// },
