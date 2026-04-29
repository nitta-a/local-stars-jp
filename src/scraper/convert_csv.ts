import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import type { Enterprise, GbizApiResponse } from "../types/gbiz";

// --- 設定 ---
const CSV_PATH = join(import.meta.dir, "../../data/gbiz_certifications.csv");
const OUTPUT_DIR = join(import.meta.dir, "../../public/data");

// CSVのヘッダー名（gBizINFOの実際のCSVに合わせて適宜修正してください）
const COL = {
  CORP_NUM: "法人番号",
  NAME: "商号または名称",
  PREF: "登記住所",
  ADDR: "所在地",
  CERT_NAME: "名称",
  CERT_DATE: "証明日",
};

function run(targetPrefName: string, prefCode: string) {
  if (!existsSync(CSV_PATH)) {
    console.error("CSVファイルが見つかりません。data/ フォルダに配置してください。");
    return;
  }

  console.log(`${targetPrefName} のデータを抽出中...`);

  // CSV読み込み（UTF-8）
  const content = readFileSync(CSV_PATH, "utf-8");
  const records = parse(content, { columns: true, skip_empty_lines: true, bom: true }) as Record<string, string>[];
  const enterpriseMap = new Map<string, Enterprise>();

  for (const row of records) {
    if (!row[COL.PREF].includes(targetPrefName)) continue;
    if (!row[COL.CERT_NAME]) continue;

    const id = row[COL.CORP_NUM];
    const newCert = {
      certification_name: row[COL.CERT_NAME],
      certified_date: row[COL.CERT_DATE] || "",
    };

    const existing = enterpriseMap.get(id);
    if (existing) {
      // 重複チェックをして認定を追加
      if (!existing.certification.some((c) => c.certification_name === newCert.certification_name)) {
        existing.certification.push(newCert);
      }
    } else {
      enterpriseMap.set(id, {
        corporate_number: id,
        name: row[COL.NAME],
        address: row[COL.ADDR],
        prefecture: row[COL.PREF],
        certification: [newCert],
      });
    }
  }

  const result: GbizApiResponse = { "hojin-infos": Array.from(enterpriseMap.values()) };

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, `${prefCode}.json`), JSON.stringify(result, null, 2));

  console.log(`成功: ${result["hojin-infos"].length} 社のデータを ${prefCode}.json に保存しました。`);
}

// 実行（秋田県）
run("秋田県", "05");
