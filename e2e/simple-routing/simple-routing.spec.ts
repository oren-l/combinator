import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { GenericContainer, type StartedTestContainer } from "testcontainers";
import waitOn from "wait-on";
import axios from "axios";
import { createLogger } from "../utils/logger";

describe("simple routing", () => {
  let container: StartedTestContainer;
  let serverEndpoint: string;
  const log = createLogger();

  beforeAll(async () => {
    log("building container image...");
    const build = await GenericContainer.fromDockerfile(".", "e2e/simple-routing/Dockerfile").build();
    log("adding combinator-proxy.json config...");
    build.withCopyContentToContainer([
      {
        target: "/workspace/combinator-proxy.json",
        content: JSON.stringify({
          routes: [
            {
              path: "/wttr",
              target: "http://wttr.in/",
            },
          ],
        }),
      },
    ]);
    build.withCommand(["combinator-proxy"]).withExposedPorts(8080);
    log("starting container...");
    container = await build.start();
    const host = container.getHost();
    const port = container.getMappedPort(8080);
    serverEndpoint = `${host}:${port}`;
    log(`waiting for server start at: ${serverEndpoint}`);
    await waitOn({
      resources: [`tcp:${serverEndpoint}`],
    });
  });

  afterAll(async () => {
    if (container !== undefined) {
      log("stopping container...");
      await container.stop();
    }
  });

  test("should proxy to `https://wttr.in` at `/wttr` path", async () => {
    const res = await axios.get(`http://${serverEndpoint}/wttr`);
    expect(res.status).toBe(200);
    expect(res.data).toContain("Weather report");
  });
});
