module.exports = neutrino => {
  neutrino.config
    .when(process.env.NODE_ENV === 'development', config => {
      config.devtool('cheap-module-source-map')
    })
    .when(process.env.NODE_ENV === 'production', config => {
      config.devtool('source-map')
    })
}
