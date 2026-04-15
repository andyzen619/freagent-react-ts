import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const databseUtils = {
  loadSqlFile: async (filePath: string) => {
    return await fs.readFile(filePath, "utf8");
  },
};
