# Scaffold a QIWI Project

Neutrino can help you quickly start new projects by scaffolding your initial project structure.
`@qiwi/create-project` uses middleware and presets behind the scene to build projects.

## Getting Started

Run the following command to start the process. Substitute `<directory-name>` with the directory name you wish to create for this project.

### Yarn

```bash
❯ yarn create @qiwi/project <directory-name>
```

_Note: The `create` command is a shorthand that helps you do two things at once. See the [Yarn create docs](https://yarnpkg.com/lang/en/docs/cli/create) for more details._

### npm/npx

```bash
❯ npx @qiwi/create-project <directory-name>
```

## Available Projects

`@qiwi/create-project` presently offers a scaffolding project to build an application, a library,
or components. Depending on the project type, the CLI helper may offer different flavors
of that project to scaffold. Each project type harnesses the power of middleware or presets to configure itself.

| Project | Project Type |
| --- | --- |
| React | Application |
| Web | Application |
| Node.js | Application |
| Web | Library |
| React Components | Components |

## Test Runners

If you wish to use a test runner, `@qiwi/create-project` will offer to set one up for you during
the scaffolding phase.

| Test Runner | Middleware |
| --- | --- |
| Jest | [`@neutrinojs/jest`](https://neutrino.js.org/packages/jest) |
| Mocha | [`@neutrinojs/mocha`](https://neutrino.js.org/packages/mocha) |

Be sure to check out the test runner preset to get more information on its features and how files should be named.

## Customization

No two JavaScript projects are ever the same, and as such there may be times when you will need to make modifications
to the way your Neutrino presets are building your project. Neutrino provides a mechanism to augment presets and
middleware in the context of a project without resorting to creating and publishing an entirely independent preset.
To override the build configuration, start with the documentation
on [customization](https://neutrino.js.org/customization).
