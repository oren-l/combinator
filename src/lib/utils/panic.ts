export function panic(message: string, options?: { exitCode: number }): never {
  console.error(message);
  process.exit(options?.exitCode ?? 1);
}
