import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { DockerComposeEnvironment, type StartedDockerComposeEnvironment } from "testcontainers";
import axios from "axios";

import { createLogger } from "../utils/logger";
import { retry } from "../utils/retry";

describe("compose", () => {
  const serverEndpoint = "localhost:8080";
  const log = createLogger();
  let environment: StartedDockerComposeEnvironment;

  beforeAll(async () => {
    log("starting environment...");
    await retry({ delayMS: 1000, maxRetries: 3 }, async () => {
      environment = await new DockerComposeEnvironment("e2e/compose", "compose.yaml").withBuild().up();
    });
  });

  afterAll(async () => {
    if (environment) {
      log("stopping environment...");
      await environment.down();
      log("environment down.");
    }
  });

  describe("routing", () => {
    test("should proxy to `http://www.wiki.org` on `/wiki`", async () => {
      log("starting test...");
      const res = await axios.get(`http://${serverEndpoint}/wiki`);
      expect(res.status).toBe(200);
      expect(res.data).toContain("MediaWiki");
    });
  });

  describe("fallback routing", () => {
    test("should proxy to `http://www.example.com` on `/`", async () => {
      log("starting test...");
      const res = await axios.get(`http://${serverEndpoint}/`);
      expect(res.status).toBe(200);
      expect(res.data).toContain("Startseite - Edirom-Summer-School");
    });

    test("should proxy to `http://www.example.com` internal page on `/2021/programm.html`", async () => {
      log("starting test...");
      const res = await axios.get(`http://${serverEndpoint}/2021/programm.html`);
      expect(res.status).toBe(200);
      expect(res.data).toContain("Kursprogramm ESS 2021 - Edirom-Summer-School");
    });
  });
});
