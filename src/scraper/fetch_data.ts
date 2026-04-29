import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { GbizApiResponse } from "../types/gbiz";

const API_KEY = process.env.GBIZ_API_KEY || "";
const BASE_URL = "https://info.gbiz.go.jp/main/hojin/api/v1/certification";
const init = { headers: { "X-Ho-Api-Key": API_KEY } };

async function fetchByPref(prefCode: string) {
  console.log(`Fetching: ${prefCode}...`);

  const url = `${BASE_URL}?prefecture=${prefCode}&limit=1000`;

  const response = await fetch(url, init).catch((error) => {
    console.error(`Fetch Error:`, error);
    return { ok: false, status: 0, json: async () => ({}) };
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const data = (await response.json()) as GbizApiResponse;

  const dirPath = join(import.meta.dir, "../../public/data");
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath);
  }

  writeFileSync(join(dirPath, `${prefCode}.json`), JSON.stringify(data, null, 2));
  console.log(`Done: ${prefCode}.json`);
}

// プロトタイプとして秋田県(05)を実行
fetchByPref("05");
