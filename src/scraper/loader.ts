import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { classifyCertificationGenre } from "../certification.ts";
import type { Enterprise } from "../types/gbiz";
import { ALL_PREFS, COL, CSV_PATH } from "./constants";

function mergeCertificationMetadata(
  existing: Enterprise["certification"][number],
  incoming: Enterprise["certification"][number],
) {
  if (incoming.certified_date) existing.certified_date = incoming.certified_date;
  if (incoming.target) existing.target = incoming.target;
  if (incoming.division) existing.division = incoming.division;
  if (incoming.issuer) existing.issuer = incoming.issuer;
  if (incoming.genre) existing.genre = incoming.genre;
}

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
    const target = row[COL.TARGET] || "";
    const division = row[COL.DIVISION] || "";
    const issuer = row[COL.ISSUER] || "";
    const newCert = {
      certification_name: row[COL.CERT_NAME],
      certified_date: row[COL.CERT_DATE] || "",
      target,
      division,
      issuer,
      genre: classifyCertificationGenre({
        certificationName: row[COL.CERT_NAME],
        issuer,
        target,
        division,
      }),
    };

    const existing = prefMap.get(id);
    if (existing) {
      const existingCert = existing.certification.find((c) => c.certification_name === newCert.certification_name);
      if (existingCert) {
        mergeCertificationMetadata(existingCert, newCert);
      } else {
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
