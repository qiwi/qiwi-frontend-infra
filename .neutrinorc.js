module.exports = {
  options: {
    root: __dirname
  },
  use: [
    [
      './packages/neutrino-preset-qiwi-lint',
      {
        eslint: {
          envs: ['browser', 'jest', 'mocha', 'node']
        }
      }
    ]
  ]
}
