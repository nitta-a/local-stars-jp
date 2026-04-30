import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { classifyCertificationGenre } from "../certification.ts";
import type { Enterprise, LaborData } from "../types/gbiz";
import { ALL_PREFS, HYOSHO_COL, HYOSHO_CSV_PATH, SHOKUBA_COL, SHOKUBA_CSV_PATH } from "./constants";

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

function normalizeOptionalValue(value: string | undefined): string | undefined {
  const normalized = value?.trim() ?? "";
  return normalized ? normalized : undefined;
}

function findPrefectureCode(address: string): string | null {
  for (const [prefName, prefCode] of Object.entries(ALL_PREFS)) {
    if (address.includes(prefName)) {
      return prefCode;
    }
  }

  return null;
}

function mergeLaborData(existing: LaborData, incoming: LaborData) {
  for (const [key, value] of Object.entries(incoming)) {
    if (!value) continue;
    existing[key as keyof LaborData] = value;
  }
}

function hasLaborData(data: LaborData): boolean {
  return Object.values(data).some(Boolean);
}

export function loadHyoshoRecords(): Record<string, string>[] {
  const content = readFileSync(HYOSHO_CSV_PATH, "utf-8");
  return parse(content, { columns: true, skip_empty_lines: true, bom: true }) as Record<string, string>[];
}

export function loadShokubaRecords(): Record<string, string>[] {
  const content = readFileSync(SHOKUBA_CSV_PATH, "utf-8");
  return parse(content, { columns: true, skip_empty_lines: true, bom: true }) as Record<string, string>[];
}

export function buildRegionalData(records: Record<string, string>[]): Map<string, Map<string, Enterprise>> {
  const regionalData = new Map<string, Map<string, Enterprise>>();
  for (const code of Object.values(ALL_PREFS)) {
    regionalData.set(code, new Map<string, Enterprise>());
  }

  for (const row of records) {
    const addressStr = row[HYOSHO_COL.PREF] || "";
    const matchedCode = findPrefectureCode(addressStr);

    if (!matchedCode) continue;
    if (!row[HYOSHO_COL.CERT_NAME]) continue;

    const id = row[HYOSHO_COL.CORP_NUM];
    const prefMap = regionalData.get(matchedCode)!;
    const target = row[HYOSHO_COL.TARGET] || "";
    const division = row[HYOSHO_COL.DIVISION] || "";
    const issuer = row[HYOSHO_COL.ISSUER] || "";
    const newCert = {
      certification_name: row[HYOSHO_COL.CERT_NAME],
      certified_date: row[HYOSHO_COL.CERT_DATE] || "",
      target,
      division,
      issuer,
      genre: classifyCertificationGenre({
        certificationName: row[HYOSHO_COL.CERT_NAME],
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
        name: row[HYOSHO_COL.NAME],
        // 所在地が空の場合は登記住所をフォールバックとして利用
        address: row[HYOSHO_COL.ADDR] || addressStr,
        prefecture: addressStr,
        certification: [newCert],
      });
    }
  }

  return regionalData;
}

export function buildLaborDataByCorporateNumber(records: Record<string, string>[]): Map<string, LaborData> {
  const laborDataByCorporateNumber = new Map<string, LaborData>();

  for (const row of records) {
    const corporateNumber = row[SHOKUBA_COL.CORP_NUM]?.trim();
    const prefAddress = row[SHOKUBA_COL.PREF] || "";
    if (!corporateNumber) continue;
    if (!findPrefectureCode(prefAddress)) continue;

    const laborData: LaborData = {
      average_continuous_service_years_scope: normalizeOptionalValue(row[SHOKUBA_COL.AVG_SERVICE_SCOPE]),
      average_continuous_service_years_male: normalizeOptionalValue(row[SHOKUBA_COL.AVG_SERVICE_MALE]),
      average_continuous_service_years_female: normalizeOptionalValue(row[SHOKUBA_COL.AVG_SERVICE_FEMALE]),
      average_continuous_service_years_regular: normalizeOptionalValue(row[SHOKUBA_COL.AVG_SERVICE_REGULAR]),
      average_employee_age: normalizeOptionalValue(row[SHOKUBA_COL.AVG_AGE]),
      monthly_overtime_hours: normalizeOptionalValue(row[SHOKUBA_COL.MONTHLY_OVERTIME]),
      female_worker_ratio_scope: normalizeOptionalValue(row[SHOKUBA_COL.FEMALE_RATIO_SCOPE]),
      female_worker_ratio: normalizeOptionalValue(row[SHOKUBA_COL.FEMALE_RATIO]),
      female_manager_count: normalizeOptionalValue(row[SHOKUBA_COL.FEMALE_MANAGER_COUNT]),
      manager_total_count: normalizeOptionalValue(row[SHOKUBA_COL.MANAGER_TOTAL_COUNT]),
      female_officer_count: normalizeOptionalValue(row[SHOKUBA_COL.FEMALE_OFFICER_COUNT]),
      officer_total_count: normalizeOptionalValue(row[SHOKUBA_COL.OFFICER_TOTAL_COUNT]),
      childcare_leave_eligible_male: normalizeOptionalValue(row[SHOKUBA_COL.CHILDCARE_ELIGIBLE_MALE]),
      childcare_leave_eligible_female: normalizeOptionalValue(row[SHOKUBA_COL.CHILDCARE_ELIGIBLE_FEMALE]),
      childcare_leave_taken_male: normalizeOptionalValue(row[SHOKUBA_COL.CHILDCARE_TAKEN_MALE]),
      childcare_leave_taken_female: normalizeOptionalValue(row[SHOKUBA_COL.CHILDCARE_TAKEN_FEMALE]),
    };
    if (!hasLaborData(laborData)) continue;

    const existing = laborDataByCorporateNumber.get(corporateNumber);
    if (existing) {
      mergeLaborData(existing, laborData);
    } else {
      laborDataByCorporateNumber.set(corporateNumber, laborData);
    }
  }

  return laborDataByCorporateNumber;
}

export function attachLaborData(
  regionalData: Map<string, Map<string, Enterprise>>,
  laborDataByCorporateNumber: Map<string, LaborData>,
): number {
  let attachedCount = 0;

  for (const prefMap of regionalData.values()) {
    for (const company of prefMap.values()) {
      const laborData = laborDataByCorporateNumber.get(company.corporate_number);
      if (!laborData) continue;
      company.labor_data = laborData;
      attachedCount += 1;
    }
  }

  return attachedCount;
}
