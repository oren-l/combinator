import fs from "node:fs";
import path from "node:path";

import { parseArgs } from "@lib/runner/cli";
import { parseRunnerConfig } from "@lib/runner/config/parse";
import { panic } from "@lib/utils/panic";
import type { RunnerConfig } from "@lib/runner/config/schema";
import { getRandomPort } from "@lib/runner/get-random-port";
import { ProxyConfig } from "@lib/proxy/config/schema";
import concurrently from "concurrently";
import { getDirname } from "@lib/utils/get-dirname";

const proxyRoutingPath = ".combinator/routing.json";

const { port, file } = parseArgs();

console.log(`port=${port} file=${file}`);

const content = fs.readFileSync(file, { encoding: "utf8" });
const result = parseRunnerConfig(content);
if (result instanceof Error) {
  panic(result.message);
}
const config: RunnerConfig = result;

console.log(config);

const appsWithPort = await Promise.all(
  config.apps.map(async (app) => {
    const port = await getRandomPort();
    return {
      name: app.name,
      path: app.path,
      port,
      command: app.cmd.replace("${port}", port.toFixed(0)),
    };
  }),
);

console.log(appsWithPort);
const proxyConfig: ProxyConfig = {
  routes: appsWithPort.map((app) => ({
    path: app.path,
    target: `http://localhost:${app.port}${app.path}`,
  })),
};

try {
  const dirname = path.dirname(proxyRoutingPath);
  fs.rmSync(dirname, { recursive: true, force: true });
  fs.mkdirSync(dirname);
  fs.writeFileSync(proxyRoutingPath, JSON.stringify(proxyConfig, null, 2));
} catch (error) {
  panic(error as string);
}

const __dirname = getDirname(import.meta.url);
console.log(__dirname);

concurrently(
  [
    {
      command: `${__dirname}/proxy.js --port=${port} --file=${proxyRoutingPath}`,
      name: "@proxy",
    },
    ...appsWithPort,
  ],
  {
    killOthers: "failure",
  },
);
