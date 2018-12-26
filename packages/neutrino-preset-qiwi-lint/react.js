const { merge: eslintMerge } = require('eslint/lib/config/config-ops')
const { ConfigurationError } = require('neutrino/errors')

module.exports = (neutrino, { test, include, exclude, eslint = {} } = {}) => {
  if (!neutrino.config.module.rules.has('lint')) {
    throw new ConfigurationError('Lint presets must be defined in .neutrinorc.js.')
  }

  const lintRule = neutrino.config.module.rules.get('lint')
  if (lintRule) {
    lintRule.use('eslint').tap(
      // Don't adjust the lint configuration for projects using their own .eslintrc.
      lintOptions =>
        lintOptions.useEslintrc
          ? lintOptions
          : eslintMerge(lintOptions, {
              baseConfig: {
                extends: [
                  require.resolve('eslint-config-standard-react'),
                  require.resolve('eslint-config-prettier/react')
                ],
                // Unfortunately we can't `require.resolve('eslint-plugin-standard')` due to:
                // https://github.com/eslint/eslint/issues/6237
                // ...so we have no choice but to rely on it being hoisted.
                plugins: ['jsx-a11y'],
                rules: {
                  // https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
                  'jsx-a11y/accessible-emoji': 'warn',
                  'jsx-a11y/alt-text': 'warn',
                  'jsx-a11y/anchor-has-content': 'warn',
                  'jsx-a11y/anchor-is-valid': [
                    'warn',
                    {
                      aspects: ['noHref', 'invalidHref']
                    }
                  ],
                  'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
                  'jsx-a11y/aria-props': 'warn',
                  'jsx-a11y/aria-proptypes': 'warn',
                  'jsx-a11y/aria-role': 'warn',
                  'jsx-a11y/aria-unsupported-elements': 'warn',
                  'jsx-a11y/heading-has-content': 'warn',
                  'jsx-a11y/iframe-has-title': 'warn',
                  'jsx-a11y/img-redundant-alt': 'warn',
                  'jsx-a11y/no-access-key': 'warn',
                  'jsx-a11y/no-distracting-elements': 'warn',
                  'jsx-a11y/no-redundant-roles': 'warn',
                  'jsx-a11y/role-has-required-aria-props': 'warn',
                  'jsx-a11y/role-supports-aria-props': 'warn',
                  'jsx-a11y/scope': 'warn'
                }
              }
            })
    )
  }
}
