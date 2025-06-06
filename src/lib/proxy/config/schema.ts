import { z } from "zod";

const route = z
  .object({
    path: z.string(),
    target: z.string(),
  })
  .strict();

export const schema = z
  .object({
    routes: z.array(route),
    fallback: z.string().optional(),
  })
  .strict();

export type ProxyConfig = z.infer<typeof schema>;
