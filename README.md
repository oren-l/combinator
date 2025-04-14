# Cli Template for NodeJS

Use this template to create npm package with executables.

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
- `pnpm run test` - not yet implemented
- `pnpm run build` - builds source to `dist` folder and installs it in each example (see [Examples](#examples) section)
- `pnpm run status` - checks project status (format + typecheck + build passes)
