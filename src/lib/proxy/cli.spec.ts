import { test, expect, describe, beforeAll, afterAll } from "vitest";
import { parseArgs } from "./cli";

describe("parseArgs", () => {
  let originalArgv: string[];

  beforeAll(() => {
    originalArgv = process.argv;
  });

  afterAll(() => {
    process.argv = originalArgv;
  });

  test("should accept numeric port argument", () => {
    process.argv = ["path/to/node", "path/to/js-executable", "--port=1234"];
    expect(parseArgs()).toMatchObject({
      port: 1234,
    });
  });

  test("should accept numeric port argument as shorthand `p`", () => {
    process.argv = ["path/to/node", "path/to/js-executable", "-p", "1234"];
    expect(parseArgs()).toMatchObject({
      port: 1234,
    });
  });

  test("should default to port 8080 when no port is specified", () => {
    process.argv = ["path/to/node", "path/to/js-executable"];
    expect(parseArgs()).toMatchObject({
      port: 8080,
    });
  });

  test("should accept path to config file argument", () => {
    process.argv = ["path/to/node", "path/to/js-executable", "--file=/path/to/file"];
    expect(parseArgs()).toMatchObject({
      file: "/path/to/file",
    });
  });

  test("should accept path to config file as shorthand `f`", () => {
    process.argv = ["path/to/node", "path/to/js-executable", "-f", "/path/to/file"];
    expect(parseArgs()).toMatchObject({
      file: "/path/to/file",
    });
  });

  test("should default to `combinator-proxy.json` file when no fie argument is specified", () => {
    process.argv = ["path/to/node", "path/to/js-executable"];
    expect(parseArgs()).toMatchObject({
      file: "combinator-proxy.json",
    });
  });
});
