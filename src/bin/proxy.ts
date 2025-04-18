import fs from "node:fs";

import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import { parseArgs } from "@lib/proxy/cli";
import { parseProxyConfig } from "@lib/proxy/config/parse";
import { panic } from "@lib/utils/panic";
import type { ProxyConfig } from "@lib/proxy/config/schema";

const { file, port } = parseArgs();

const content = fs.readFileSync(file, { encoding: "utf8" });
const result = parseProxyConfig(content);
if (result instanceof Error) {
  panic(result.message);
}

const config: ProxyConfig = result;
console.log(config);

const app = express();

config.routes.forEach((route) => {
  app.use(
    createProxyMiddleware({
      pathFilter: route.path,
      pathRewrite: {
        [`^${route.path}`]: "",
      },
      target: route.target,
      changeOrigin: true,
    }),
  );
});

if (config.fallback) {
  app.use(
    createProxyMiddleware({
      target: config.fallback,
      changeOrigin: true,
    }),
  );
}

const server = app.listen(port, () => {
  console.log(`server listening on ${port}`);
});

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, () => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  });
});
