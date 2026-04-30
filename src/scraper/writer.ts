import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Enterprise, GbizApiResponse } from "../types/gbiz";
import { ALL_PREFS, OUTPUT_DIR } from "./constants";
import { buildPrefecturePageSummaries, writePrefecturePages, writeSitemap } from "./static-page";

export function writeOutputFiles(regionalData: Map<string, Map<string, Enterprise>>): void {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
  const countsByCode = new Map<string, number>();

  for (const [, code] of Object.entries(ALL_PREFS).sort((left, right) => left[1].localeCompare(right[1]))) {
    const prefMap = regionalData.get(code) ?? new Map<string, Enterprise>();
    const all = Array.from(prefMap.values());
    const withCoords = all.filter((c) => c.lat !== undefined && c.lng !== undefined);
    const skipped = all.length - withCoords.length;
    const result: GbizApiResponse = { "hojin-infos": withCoords };
    writeFileSync(join(OUTPUT_DIR, `${code}.json`), JSON.stringify(result, null, 2));
    countsByCode.set(code, withCoords.length);
    const skipNote = skipped > 0 ? ` (座標なし除外: ${skipped} 社)` : "";
    console.log(`- ${code}.json 出力完了: ${withCoords.length} 社${skipNote}`);
  }

  const pageSummaries = buildPrefecturePageSummaries(countsByCode);
  writePrefecturePages(pageSummaries);
  writeSitemap(pageSummaries);
}
