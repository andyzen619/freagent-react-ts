import fs from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface StatCategory {
  stat: {
    stat_id: number;
    name: string;
    display_name: string;
  };
}

let statMap: Record<string, string> | null = null;

export const statMapper = {
  getDisplayName: async (statId: string | number): Promise<string> => {
    if (!statMap) {
      const filePath = join(__dirname, "../../docs/yahooStatCategories.json");
      const content = await fs.readFile(filePath, "utf8");
      const data = JSON.parse(content);
      
      statMap = {};
      const stats = data.fantasy_content.game[1].stat_categories.stats;
      
      stats.forEach((s: StatCategory) => {
        statMap![s.stat.stat_id.toString()] = s.stat.display_name;
      });
    }
    
    return statMap[statId.toString()] || statId.toString();
  }
};
