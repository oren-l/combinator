import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "e2e",
    include: ["e2e/**/*.spec.ts"],
    testTimeout: 10 * 1000,
    hookTimeout: 120 * 1000,
  },
});
