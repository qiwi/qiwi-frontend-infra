const PROJECT = 'project'
const TESTING = 'testing'
const N = 'neutrino'
const REACT = '@qiwi/neutrino-preset-frontend-infra/react'
const NODE = '@qiwi/neutrino-preset-frontend-infra/node'
const WEB = '@neutrinojs/web'
const WEB_NODE_LIBRARY = '@neutrinojs/library'
const REACT_COMPONENTS = '@neutrinojs/react-components'
const JEST = '@neutrinojs/jest'
const MOCHA = '@neutrinojs/mocha'
const QIWI_INFRA = '@qiwi/neutrino-preset-frontend-infra'

const projects = {
  [NODE]: {
    type: PROJECT,
    devDependencies: [QIWI_INFRA, N],
  },
  [REACT]: {
    type: PROJECT,
    dependencies: ['prop-types', 'react', 'react-dom', 'react-hot-loader'],
    devDependencies: [QIWI_INFRA, N],
  },
  [WEB_NODE_LIBRARY]: {
    type: PROJECT,
    linter: `${QIWI_INFRA}/lint/node`,
    devDependencies: [WEB_NODE_LIBRARY, QIWI_INFRA, N],
  },
  [REACT_COMPONENTS]: {
    type: PROJECT,
    linter: `${QIWI_INFRA}/lint/react`,
    devDependencies: [REACT_COMPONENTS, QIWI_INFRA, N, 'prop-types', 'react', 'react-dom'],
  },
  [WEB]: {
    type: PROJECT,
    linter: `${QIWI_INFRA}/lint/base`,
    devDependencies: [WEB, QIWI_INFRA, N],
  },
  [JEST]: {
    type: TESTING,
    devDependencies: [JEST, 'jest'],
  },
  [MOCHA]: {
    type: TESTING,
    devDependencies: [MOCHA, 'mocha'],
  },
}

const packages = {
  NEUTRINO: N,
  REACT,
  WEB,
  NODE,
  WEB_NODE_LIBRARY,
  REACT_COMPONENTS,
  JEST,
  MOCHA,
  QIWI_INFRA,
}

module.exports = {projects, packages}
