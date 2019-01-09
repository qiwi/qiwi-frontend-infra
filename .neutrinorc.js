module.exports = {
  options: {
    root: __dirname
  },
  use: [
    [
      './packages/neutrino-preset-qiwi-lint/node',
      {
        eslint: {
          envs: ['jest']
        }
      }
    ]
  ]
}
