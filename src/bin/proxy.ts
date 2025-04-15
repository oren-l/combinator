import { parseArgs } from "@lib/proxy/cli";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const { port } = parseArgs();

const server = express();

server.use(
  createProxyMiddleware({
    pathFilter: "/wttr",
    target: "https://wttr.in",
    changeOrigin: true,
  }),
);

server.listen(port, () => {
  console.log(`server listening on ${port}`);
});
