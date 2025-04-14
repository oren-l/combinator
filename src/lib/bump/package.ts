import fs from "node:fs/promises";

import { Version } from "./version";

async function getPackage() {
  const content = await fs.readFile("package.json", { encoding: "utf-8" });
  return JSON.parse(content);
}

export async function getCurrentVersion() {
  const data = await getPackage();
  return data.version as string;
}

export async function setCurrentVersion(version: Version) {
  const data = await getPackage();
  data.version = version.toString();
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile("package.json", content);
}
