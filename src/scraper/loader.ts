import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import type { Enterprise } from "../types/gbiz";
import { ALL_PREFS, COL, CSV_PATH } from "./constants";

export function loadRecords(): Record<string, string>[] {
  const content = readFileSync(CSV_PATH, "utf-8");
  return parse(content, { columns: true, skip_empty_lines: true, bom: true }) as Record<string, string>[];
}

export function buildRegionalData(records: Record<string, string>[]): Map<string, Map<string, Enterprise>> {
  const regionalData = new Map<string, Map<string, Enterprise>>();
  for (const code of Object.values(ALL_PREFS)) {
    regionalData.set(code, new Map<string, Enterprise>());
  }

  for (const row of records) {
    const addressStr = row[COL.PREF] || "";
    let matchedCode: string | null = null;

    for (const [prefName, prefCode] of Object.entries(ALL_PREFS)) {
      if (addressStr.includes(prefName)) {
        matchedCode = prefCode;
        break;
      }
    }

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

  return regionalData;
}
