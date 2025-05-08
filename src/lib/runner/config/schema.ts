import { z } from "zod";

const app = z
  .object({
    name: z.string().describe("app name, used in logs and commands"),
    cmd: z.string().describe("command that starts the app"),
    path: z.string().describe("exposed path that serves the app"),
  })
  .strict();

export const schema = z
  .object({
    $schema: z.string().optional(),
    apps: z.array(app),
  })
  .strict();

export type RunnerConfig = z.infer<typeof schema>;
