# Neutrino Less Loader Middleware

`@qiwi/neutrino-less-loader` is Neutrino middleware for loading and importing less from modules.

## Requirements

- Node.js v8.3+
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

`@qiwi/neutrino-less-loader` can be installed via the Yarn or npm clients.

### Yarn

```bash
❯ yarn add @qiwi/neutrino-less-loader
```

### npm

```bash
❯ npm install --save @qiwi/neutrino-less-loader
```

## Usage

`@qiwi/neutrino-less-loader` can be consumed from the Neutrino API, middleware, or presets. Require this package
and plug it into Neutrino:

```js
// Using function middleware format
const lessLoader = require('@qiwi/neutrino-less-loader');

// Use with default options
neutrino.use(lessLoader);

// Usage showing default options
neutrino.use(lessLoader, {
  ruleId: 'less',
  less: {},
});
```

```js
// Using object or array middleware format

// Use with default options
module.exports = {
  use: ['@qiwi/neutrino-less-loader']
};

// Usage showing default options
module.exports = {
  use: [
    ['@qiwi/neutrino-less-loader', {
      ruleId: 'less',
      less: {},
    }]
  ]
};
```

- `less`: Set options for the less-loader used when loading LESS files.
- `ruleId`: The ID of the webpack-chain rule used to identify the stylesheet loaders
