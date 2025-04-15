export function createLogger() {
  let lastTimestamp = performance.now();

  function log(message: string) {
    const currentTimestamp = performance.now();
    const delta = currentTimestamp - lastTimestamp;
    console.log(`+${(delta / 1000).toFixed(3)}s ${message}`);
    lastTimestamp = currentTimestamp;
  }

  return log;
}
