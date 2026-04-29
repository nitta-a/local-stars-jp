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

// 全都道府県のマッピング
const ALL_PREFS: Record<string, string> = {
  北海道: "01",
  青森県: "02",
  岩手県: "03",
  宮城県: "04",
  秋田県: "05",
  山形県: "06",
  福島県: "07",
  茨城県: "08",
  栃木県: "09",
  群馬県: "10",
  埼玉県: "11",
  千葉県: "12",
  東京都: "13",
  神奈川県: "14",
  新潟県: "15",
  富山県: "16",
  石川県: "17",
  福井県: "18",
  山梨県: "19",
  長野県: "20",
  岐阜県: "21",
  静岡県: "22",
  愛知県: "23",
  三重県: "24",
  滋賀県: "25",
  京都府: "26",
  大阪府: "27",
  兵庫県: "28",
  奈良県: "29",
  和歌山県: "30",
  鳥取県: "31",
  島根県: "32",
  岡山県: "33",
  広島県: "34",
  山口県: "35",
  徳島県: "36",
  香川県: "37",
  愛媛県: "38",
  高知県: "39",
  福岡県: "40",
  佐賀県: "41",
  長崎県: "42",
  熊本県: "43",
  大分県: "44",
  宮崎県: "45",
  鹿児島県: "46",
  沖縄県: "47",
};

function run() {
  if (!existsSync(CSV_PATH)) {
    console.error("CSVファイルが見つかりません。data/ フォルダに配置してください。");
    return;
  }

  console.log("全都道府県のデータを抽出・振り分け中...");

  const content = readFileSync(CSV_PATH, "utf-8");
  const records = parse(content, { columns: true, skip_empty_lines: true, bom: true }) as Record<string, string>[];

  // 都道府県コードごとのMapを初期化
  const regionalData = new Map<string, Map<string, Enterprise>>();
  Object.values(ALL_PREFS).forEach((code) => {
    regionalData.set(code, new Map<string, Enterprise>());
  });

  for (const row of records) {
    const addressStr = row[COL.PREF] || "";
    let matchedCode: string | null = null;

    // 登記住所から対象の県を判定
    for (const [prefName, prefCode] of Object.entries(ALL_PREFS)) {
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

  console.log("すべての都道府県データの処理が完了しました。");
}

run();
