module.exports = (neutrino, opts) => {
  const defaults = {
    '~': neutrino.options.source
  }
  const alias = opts || defaults

  Object.keys(alias).map(key => neutrino.config.resolve.alias.set(key, alias[key]))
}
