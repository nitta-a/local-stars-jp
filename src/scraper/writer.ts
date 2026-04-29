import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Enterprise, GbizApiResponse } from "../types/gbiz";
import { OUTPUT_DIR } from "./constants";

export function writeOutputFiles(regionalData: Map<string, Map<string, Enterprise>>): void {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
  for (const [code, prefMap] of regionalData.entries()) {
    const all = Array.from(prefMap.values());
    const withCoords = all.filter((c) => c.lat !== undefined && c.lng !== undefined);
    const skipped = all.length - withCoords.length;
    const result: GbizApiResponse = { "hojin-infos": withCoords };
    writeFileSync(join(OUTPUT_DIR, `${code}.json`), JSON.stringify(result, null, 2));
    const skipNote = skipped > 0 ? ` (座標なし除外: ${skipped} 社)` : "";
    console.log(`- ${code}.json 出力完了: ${withCoords.length} 社${skipNote}`);
  }
}
