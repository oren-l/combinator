import "zx/globals";

import { Version } from "@lib/bump/version";
import { getCurrentVersion, setCurrentVersion } from "@lib/bump/package";

const argv = process.argv.slice(2);

const versionStr = await getCurrentVersion();
const version = new Version(versionStr);

if (argv.length === 0) {
  showUsage(version);
  process.exit(1);
}

if (["-h", "--help"].includes(argv[0] as string)) {
  showUsage(version);
  process.exit(0);
}

const part = argv[0];

if (part === "major") {
  await setCurrentVersion(version.bump("major"));
  process.exit(0);
}
if (part === "minor") {
  await setCurrentVersion(version.bump("minor"));
  process.exit(0);
}
if (part === "build") {
  await setCurrentVersion(version.bump("build"));
  process.exit(0);
}

echo(chalk.red(`invalid argument "${part}"\n`));
showUsage(version);
process.exit(1);

function showUsage(version: Version) {
  echo`Bump ${chalk.gray("package.json")} version.\n`;
  echo`Usage: ${chalk.whiteBright.bold("bump (major|minor|build)")}\n`;
  echo`Current version is ${chalk.greenBright(versionStr)}\n`;
  echo`- ${chalk.whiteBright.bold("bump major")} ==> ${chalk.greenBright(version.bump("major"))}`;
  echo`- ${chalk.whiteBright.bold("bump minor")} ==> ${chalk.greenBright(version.bump("minor"))}`;
  echo`- ${chalk.whiteBright.bold("bump build")} ==> ${chalk.greenBright(version.bump("build"))}`;
}
