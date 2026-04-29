import { existsSync } from "node:fs";
import { CSV_PATH } from "./constants";
import { applyCoords, geocodeAddresses, loadGeoCache } from "./geocoder";
import { buildRegionalData, loadRecords } from "./loader";
import { writeOutputFiles } from "./writer";

async function run() {
  if (!existsSync(CSV_PATH)) {
    console.error("CSVファイルが見つかりません。data/ フォルダに配置してください。");
    return;
  }

  console.log("全都道府県のデータを抽出・振り分け中...");
  const records = loadRecords();
  const regionalData = buildRegionalData(records);

  // 既存JSONからキャッシュ読み込み（再実行時スキップ用）
  const existingCache = loadGeoCache(regionalData);
  console.log(`既存キャッシュから ${existingCache.size} 件の座標を読み込みました。`);

  // 未キャッシュの住所のみジオコーディング
  const allAddrs = new Set<string>();
  for (const prefMap of regionalData.values()) {
    for (const company of prefMap.values()) allAddrs.add(company.address);
  }
  const uncached = [...allAddrs].filter((a) => !existingCache.has(a));
  console.log(`\n${uncached.length} 件の住所をジオコーディング中... (スキップ: ${allAddrs.size - uncached.length} 件)`);
  const newCache = await geocodeAddresses(uncached);
  console.log("ジオコーディング完了\n");

  const addrCache = new Map([...existingCache, ...newCache]);
  applyCoords(regionalData, addrCache);

  writeOutputFiles(regionalData);
  console.log("すべての都道府県データの処理が完了しました。");
}

run();

