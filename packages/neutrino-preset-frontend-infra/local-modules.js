const loaderMerge = require('@neutrinojs/loader-merge')

module.exports = neutrino => {
  neutrino.config.when(neutrino.config.module.rules.has('lint'), () =>
    neutrino.use(loaderMerge('lint', 'eslint'), {
      overrides: [
        {
          files: ['local_modules/**/*.js'],
          rules: {
            'node/no-unpublished-require': 'off',
          },
        },
      ],
    })
  )

  neutrino.config.resolve.modules.add('local_modules')
}
