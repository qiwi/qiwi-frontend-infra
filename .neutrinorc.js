module.exports = {
  options: {
    root: __dirname
  },
  use: [
    [
      './packages/neutrino-preset-qiwi-lint/node',
      {
        eslint: {
          envs: ['browser', 'jest', 'mocha'],
          baseConfig: {
            overrides: [
              {
                files: ['packages/create-project/commands/init/templates/**'],
                rules: {
                  // The dependencies in create-project's templates are installed by
                  // by create-project and so are expected to be missing from package.json.
                  'node/no-extraneous-require': 'off',
                  'no-unused-vars': 'off'
                }
              }
            ]
          }
        }
      }
    ]
  ]
}
