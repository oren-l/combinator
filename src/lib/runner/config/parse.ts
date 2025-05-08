import { ZodError } from "zod";
import { type RunnerConfig, schema } from "./schema";

/**
 * Parses and validates raw string content to config object.
 *
 * Errors are formatted for stdout/stderr.
 */
export function parseRunnerConfig(strData: string): RunnerConfig | Error {
  try {
    const result = schema.parse(JSON.parse(strData));
    delete result.$schema;
    return result;
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues.map((issue) => `- ${issue.message} "${issue.path.join(".")}"`);
      return new Error(`invalid config:\n${issues.join("\n")}`);
    } else if (error instanceof SyntaxError) {
      return new Error(`invalid config: not a valid json:\n${error.message}\nconfig: ${strData}`);
    } else {
      return new Error(`unexpected error: ${error}`);
    }
  }
}
