const loaderMerge = require('@neutrinojs/loader-merge')
const lint = require('./base')

module.exports = (neutrino, options) => {
  neutrino.use(lint, {
    baseConfig: {
      extends: ['airbnb/rules/react.js', 'airbnb/rules/react-a11y.js'],
    },
    envs: ['browser', 'worker', 'serviceworker'],
    rules: {
      'no-console': process.env.NODE_ENV === 'development' ? 'off' : 'error',
      'class-methods-use-this': 'off',

      // react plugin
      'react/forbid-prop-types': 'off',
      'react/jsx-first-prop-new-line': ['error', 'multiline'],
      'react/jsx-filename-extension': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/require-default-props': 'off',
      'react/require-extension': 'off',
      'react/self-closing-comp': 'off',

      // react-a11y plugin
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['to'],
        },
      ],
      'jsx-a11y/click-events-have-key-events': 'off',
    },
  })

  if (options) {
    neutrino.use(loaderMerge('lint', 'eslint'), options)
  }
}
