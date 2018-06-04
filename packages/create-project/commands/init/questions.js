const {packages} = require('./utils')

const NONE = {name: 'None', value: false}
const APPLICATION = {name: 'A web or Node.js application', value: 'application'}
const LIBRARY = {name: 'A library', value: 'library'}
const COMPONENTS = {name: 'Components', value: 'components'}
const REACT = {name: 'React', value: packages.REACT}
const WEB = {name: 'Some other web app, e.g. jQuery, or plain JS', value: packages.WEB}
const NODE = {name: 'Node.js', value: packages.NODE}
const WEB_NODE_LIBRARY = {name: 'Web and/or Node.js', value: packages.WEB_NODE_LIBRARY}
const REACT_COMPONENTS = {name: 'React Components', value: packages.REACT_COMPONENTS}
const JEST = {name: 'Jest', value: packages.JEST}
const MOCHA = {name: 'Mocha', value: packages.MOCHA}

module.exports = () => [
  {
    name: 'projectType',
    type: 'list',
    message: '🤔  First up, what would you like to create?',
    choices: [APPLICATION, LIBRARY, COMPONENTS],
  },
  {
    name: 'project',
    type: 'list',
    message: '🤔  Next, what kind of application would you like to create?',
    when: data => data.projectType === APPLICATION.value,
    choices: [REACT, NODE, WEB],
  },
  {
    name: 'project',
    type: 'list',
    message: '🤔  Next, what kind of library would you like to create?',
    when: data => data.projectType === LIBRARY.value,
    choices: [WEB_NODE_LIBRARY],
  },
  {
    name: 'project',
    type: 'list',
    message: '🤔  Next, what kind of components would you like to create?',
    when: data => data.projectType === COMPONENTS.value,
    choices: [REACT_COMPONENTS],
  },
  {
    name: 'testRunner',
    type: 'list',
    message: '🤔  Would you like to add a test runner to your project?',
    choices: [JEST, MOCHA, NONE],
  },
]
