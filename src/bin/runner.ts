import fs from "node:fs";
import { parseArgs } from "@lib/runner/cli";
import { parseRunnerConfig } from "@lib/runner/config/parse";
import { panic } from "@lib/utils/panic";
import type { RunnerConfig } from "@lib/runner/config/schema";

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
