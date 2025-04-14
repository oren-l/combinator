import * as esbuild from "esbuild";

await esbuild
  .build({
    entryPoints: ["src/bin/*.ts"],
    bundle: true,
    packages: "external",
    platform: "node",
    format: "esm",
    outdir: "dist",
    sourcemap: true,
    minify: process.env.NODE_ENV === "production",
    target: ["node16"],
    logLevel: "info",
    banner: {
      js: "#!/usr/bin/env node",
    },
  })
  .catch(() => process.exit(1));
