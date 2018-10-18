const LINTING = 'linting'
const PROJECT = 'project'
const TESTING = 'testing'

const N = 'neutrino'
const REACT = '@neutrinojs/react'
const WEB = '@neutrinojs/web'
const NODE = '@neutrinojs/node'
const WEB_NODE_LIBRARY = '@neutrinojs/library'
const REACT_COMPONENTS = '@neutrinojs/react-components'
const JEST = '@neutrinojs/jest'
const MOCHA = '@neutrinojs/mocha'
const QIWI_LINT_PRESET = '@qiwi/neutrino-preset-qiwi-lint'

const WEBPACK = 'webpack@^4';
const WEBPACK_CLI = 'webpack-cli@^3';
const WEBPACK_DEV_SERVER = 'webpack-dev-server@^3';

const presets = {
  [NODE]: {
    type: PROJECT,
    devDependencies: [NODE, N, WEBPACK, WEBPACK_CLI],
  },
  [REACT]: {
    type: PROJECT,
    dependencies: ['prop-types@^15', 'react@^16', 'react-dom@^16', 'react-hot-loader@^4'],
    devDependencies: [REACT, N, WEBPACK, WEBPACK_CLI, WEBPACK_DEV_SERVER]
  },
  [WEB_NODE_LIBRARY]: {
    type: PROJECT,
    devDependencies: [WEB_NODE_LIBRARY,
      N,
      WEBPACK,
      WEBPACK_CLI],
  },
  [REACT_COMPONENTS]: {
    type: PROJECT,
    devDependencies: [REACT_COMPONENTS,
      N,
      'prop-types@^15',
      'react@^16',
      'react-dom@^16',
      WEBPACK, WEBPACK_CLI, WEBPACK_DEV_SERVER],
  },
  [WEB]: {
    type: PROJECT,
    devDependencies: [WEB, N, WEBPACK, WEBPACK_CLI, WEBPACK_DEV_SERVER],
  },
  [JEST]: {
    type: TESTING,
    devDependencies: [JEST, 'jest@^23'],
  },
  [MOCHA]: {
    type: TESTING,
    devDependencies: [MOCHA, 'mocha@^5'],
  },
  [QIWI_LINT_PRESET]: {
    type: LINTING,
    // devDependencies: [QIWI_LINT_PRESET, 'eslint@^5']
    devDependencies: ['eslint@^5']
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
  QIWI_LINT_PRESET,
}

module.exports = {presets, packages}
