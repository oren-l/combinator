# Combinator

## Roadmap

- [x] Route a single endpoint to a configurable outgoing path
- [ ] Route multiple endpoints
- [ ] Create config format
- [x] Add e2e tests (using docker - testcontainers)
- [ ] Add [HMR](https://webpack.js.org/concepts/hot-module-replacement/) support
- [ ] Add configurable fallback routing
- [ ] Add websocket support
- [ ] Add support for cookie domain rewrite
- [ ] Enable running apps from combinator (will start and proxy them)
- [ ] Enable random port assignment for apps starting from combinator

## Requirements

- NodeJS
- pnpm

## Folder Structure

```
├── examples
├── scripts
└── src
    ├── bin
    └── lib
```

### examples

Each folder in the `examples` folder is a usage demo of this package.

In each example, a `README.md` file will explain specific details for that example.

### scripts

Development scripts for this project.

### src

This project source code.

Each file in the `src/bin` directory is built using `pnpm run build` command to `dist` directory.

Files in `src/lib` directory are available for import under `@lib/`. For example `import {...} from "@lib/bump/version"`

The files in `src/bin` and `src/lib` are just for demonstration purposes, remove them when using this template.

## Executables

When installing this package via npm, the executables that are available are only the ones that are declared in `package.json`→`bin` property.

## Available Scripts

- `pnpm run format:check` - only check formatting
- `pnpm run format:write` - fix formatting
- `pnpm run typecheck` - check typescript rules
- `pnpm run test` - run unittest
- `pnpm run test:watch` - run unittest and rerun on changes
- `pnpm run test:debug` - run unittest in debug mode
- `pnpm run e2e` - run e2e tests
- `pnpm run e2e:watch` - run e2e tests and rerun on test files changes (not source code!)
- `pnpm run e2e:debug` - run e2e tests in debugging mode
- `pnpm run build` - builds source to `dist` folder and installs it in each example (see [Examples](#examples) section)
- `pnpm run status:quick` - checks project status (format + typecheck + unittest + build passes)
- `pnpm run status:full` - checks full project status (status:quick + e2e tests)
