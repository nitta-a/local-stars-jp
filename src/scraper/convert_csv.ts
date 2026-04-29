import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import type { Enterprise, GbizApiResponse } from "../types/gbiz";

// --- 設定 ---
const CSV_PATH = join(import.meta.dir, "../../data/gbiz_certifications.csv");
const OUTPUT_DIR = join(import.meta.dir, "../../docs/data");

// CSVのヘッダー名
const COL = {
  CORP_NUM: "法人番号",
  NAME: "商号または名称",
  PREF: "登記住所",
  ADDR: "所在地",
  CERT_NAME: "名称",
  CERT_DATE: "証明日",
};

// 東北6県のマッピング
const TOHOKU_PREFS: Record<string, string> = {
  青森県: "02",
  岩手県: "03",
  宮城県: "04",
  秋田県: "05",
  山形県: "06",
  福島県: "07",
};

function run() {
  if (!existsSync(CSV_PATH)) {
    console.error("CSVファイルが見つかりません。data/ フォルダに配置してください。");
    return;
  }

  console.log("東北6県のデータを抽出・振り分け中...");

  const content = readFileSync(CSV_PATH, "utf-8");
  const records = parse(content, { columns: true, skip_empty_lines: true, bom: true }) as Record<string, string>[];

  // 都道府県コードごとのMapを初期化
  const regionalData = new Map<string, Map<string, Enterprise>>();
  Object.values(TOHOKU_PREFS).forEach((code) => {
    regionalData.set(code, new Map<string, Enterprise>());
  });

  for (const row of records) {
    const addressStr = row[COL.PREF] || "";
    let matchedCode: string | null = null;

    // 登記住所から対象の県を判定
    for (const [prefName, prefCode] of Object.entries(TOHOKU_PREFS)) {
      if (addressStr.includes(prefName)) {
        matchedCode = prefCode;
        break;
      }
    }

    // 対象外の県、または認定名がない場合はスキップ
    if (!matchedCode) continue;
    if (!row[COL.CERT_NAME]) continue;

    const id = row[COL.CORP_NUM];
    const prefMap = regionalData.get(matchedCode)!;

    const newCert = {
      certification_name: row[COL.CERT_NAME],
      certified_date: row[COL.CERT_DATE] || "",
    };

    const existing = prefMap.get(id);
    if (existing) {
      if (!existing.certification.some((c) => c.certification_name === newCert.certification_name)) {
        existing.certification.push(newCert);
      }
    } else {
      prefMap.set(id, {
        corporate_number: id,
        name: row[COL.NAME],
        // 所在地が空の場合は登記住所をフォールバックとして利用
        address: row[COL.ADDR] || addressStr,
        prefecture: addressStr,
        certification: [newCert],
      });
    }
  }

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  // 抽出した各県ごとにJSONを出力
  for (const [code, prefMap] of regionalData.entries()) {
    const result: GbizApiResponse = { "hojin-infos": Array.from(prefMap.values()) };
    writeFileSync(join(OUTPUT_DIR, `${code}.json`), JSON.stringify(result, null, 2));
    console.log(`- ${code}.json 出力完了: ${result["hojin-infos"].length} 社`);
  }

  console.log("すべての東北地方データの処理が完了しました。");
}

run();
