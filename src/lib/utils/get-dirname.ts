import { fileURLToPath } from "url";
import { dirname } from "path";

export function getDirname(fileURL: string): string {
  const filePath = fileURLToPath(fileURL);
  return dirname(filePath);
}
