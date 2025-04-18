import { describe, test, expect, afterEach } from "vitest";
import { GenericContainer, type StartedTestContainer } from "testcontainers";
import waitOn from "wait-on";
import axios from "axios";
import { createLogger } from "../utils/logger";

describe.concurrent("simple routing", { timeout: 60 * 1000 }, () => {
  let container: StartedTestContainer;
  const log = createLogger();

  afterEach(async () => {
    if (container !== undefined) {
      log("stopping container...");
      await container.stop();
    }
  });

  test("should start server at default port (8080) when no port is specified", async () => {
    log("building container image...");
    const image = await GenericContainer.fromDockerfile(".", "e2e/simple-routing/Dockerfile").build();
    log("adding combinator-proxy.json config...");
    image.withCopyContentToContainer([
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
    image.withCommand(["combinator-proxy"]).withExposedPorts(8080);
    log("starting container...");
    container = await image.start();
    const host = container.getHost();
    const port = container.getMappedPort(8080);
    const serverEndpoint = `${host}:${port}`;
    log(`waiting for server start at: ${serverEndpoint}`);
    await waitOn({
      resources: [`tcp:${serverEndpoint}`],
    });
    const res = await axios.get(`http://${serverEndpoint}/wttr`);
    expect(res.status).toBe(200);
    expect(res.data).toContain("Weather report");
  });

  test("should start server at specified port when port is specified", async () => {
    log("building container image...");
    const image = await GenericContainer.fromDockerfile(".", "e2e/simple-routing/Dockerfile").build();
    log("adding combinator-proxy.json config...");
    image.withCopyContentToContainer([
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
    image.withCommand(["combinator-proxy", "--port=3000"]).withExposedPorts(3000);
    log("starting container...");
    container = await image.start();
    const host = container.getHost();
    const port = container.getMappedPort(3000);
    const serverEndpoint = `${host}:${port}`;
    log(`waiting for server start at: ${serverEndpoint}`);
    await waitOn({
      resources: [`tcp:${serverEndpoint}`],
    });
    const res = await axios.get(`http://${serverEndpoint}/wttr`);
    expect(res.status).toBe(200);
    expect(res.data).toContain("Weather report");
  });

  test("should proxy multiple routes", async () => {
    log("building container image...");
    const image = await GenericContainer.fromDockerfile(".", "e2e/simple-routing/Dockerfile").build();
    log("adding combinator-proxy.json config...");
    image.withCopyContentToContainer([
      {
        target: "/workspace/combinator-proxy.json",
        content: JSON.stringify({
          routes: [
            {
              path: "/wttr",
              target: "http://wttr.in/",
            },
            {
              path: "/reverse-proxy",
              target: "https://en.wikipedia.org/wiki/Reverse_proxy",
            },
          ],
        }),
      },
    ]);
    // image.withEnvironment({ DEBUG: "http-proxy-middleware*" });
    image.withCommand(["combinator-proxy"]).withExposedPorts(8080);
    log("starting container...");
    container = await image.start();
    const host = container.getHost();
    const port = container.getMappedPort(8080);
    const serverEndpoint = `${host}:${port}`;
    log(`waiting for server start at: ${serverEndpoint}`);
    await waitOn({
      resources: [`tcp:${serverEndpoint}`],
    });
    const resWttr = await axios.get(`http://${serverEndpoint}/wttr`);
    expect(resWttr.status).toBe(200);
    expect(resWttr.data).toContain("Weather report");

    const resProxy = await axios.get(`http://${serverEndpoint}/reverse-proxy`);
    expect(resProxy.status).toBe(200);
    expect(resProxy.data).toContain("Reverse proxy");
  });

  test("should support fallback routing", async () => {
    log("building container image...");
    const image = await GenericContainer.fromDockerfile(".", "e2e/simple-routing/Dockerfile").build();
    log("adding combinator-proxy.json config...");
    image.withCopyContentToContainer([
      {
        target: "/workspace/combinator-proxy.json",
        content: JSON.stringify({
          routes: [
            {
              path: "/wttr",
              target: "http://wttr.in/",
            },
          ],
          fallback: "https://developer.mozilla.org",
        }),
      },
    ]);
    image.withCommand(["combinator-proxy"]).withExposedPorts(8080);
    log("starting container...");
    container = await image.start();
    const host = container.getHost();
    const port = container.getMappedPort(8080);
    const serverEndpoint = `${host}:${port}`;
    log(`waiting for server start at: ${serverEndpoint}`);
    await waitOn({
      resources: [`tcp:${serverEndpoint}`],
    });
    const resWttr = await axios.get(`http://${serverEndpoint}/wttr`);
    expect(resWttr.status).toBe(200);
    expect(resWttr.data).toContain("Weather report");

    const resProxy = await axios.get(`http://${serverEndpoint}/`);
    expect(resProxy.status).toBe(200);
    expect(resProxy.data).toContain("MDN Web Docs");
  });
});
