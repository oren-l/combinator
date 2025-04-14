/**
 * Installs latest packaged build to all of the examples
 */

import "zx/globals";

$.verbose = true;

const examplesPath = "examples";

const examples = fs
  .readdirSync(examplesPath)
  .map((item) => path.join(examplesPath, item))
  .filter(isNotHidden)
  .filter(isDirectory);

echo(chalk.whiteBright(`Found ${examples.length} examples:`));
echo(examples.map((s) => `- ${s}`).join("\n"));

for (const item of examples) {
  echo(chalk.whiteBright(`\nupdating ${chalk.bold.greenBright(item)}...`));
  cd(item);
  await $`npm install --no-save ../.npm-local/my-cli-project.tgz`;
}

function isNotHidden(item) {
  return !path.basename(item).startsWith(".");
}

function isDirectory(item) {
  return fs.statSync(item).isDirectory();
}
