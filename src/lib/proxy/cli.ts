import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export function parseArgs() {
  const args = yargs(hideBin(process.argv))
    .scriptName("combinator-proxy")
    .usage("$0 [args]")
    .option("port", {
      alias: "p",
      type: "number",
      description: "port to use",
      default: 8080,
    })
    .parseSync();

  return args;
}
