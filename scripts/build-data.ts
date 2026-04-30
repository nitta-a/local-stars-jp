import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadAwardMaster } from "../src/data/award-master";
import { SHOKUBA_CSV_PATH } from "../src/scraper/constants";
import {
  attachLaborData,
  buildLaborDataByCorporateNumber,
  buildRegionalData,
  loadHyoshoRecords,
  loadShokubaRecords,
} from "../src/scraper/loader";
import type { Enterprise } from "../src/types/gbiz";

interface ProcessedCompaniesFile {
  generated_at: string;
  award_master_count: number;
  companies: Enterprise[];
}

const OUTPUT_DIR = join(import.meta.dir, "../public/data");
const OUTPUT_PATH = join(OUTPUT_DIR, "processed-companies.json");

function flattenRegionalData(regionalData: Map<string, Map<string, Enterprise>>): Enterprise[] {
  return [...regionalData.values()]
    .flatMap((prefMap) => [...prefMap.values()])
    .sort((left, right) => {
      const prefOrder = left.prefecture.localeCompare(right.prefecture, "ja");
      if (prefOrder !== 0) return prefOrder;
      return left.name.localeCompare(right.name, "ja");
    })
    .map((company) => ({
      ...company,
      certification: [...company.certification].sort((left, right) =>
        left.certification_name.localeCompare(right.certification_name, "ja"),
      ),
    }));
}

async function run() {
  console.log("表彰情報CSVを読み込み中...");
  const hyoshoRecords = loadHyoshoRecords();
  const regionalData = buildRegionalData(hyoshoRecords);

  if (existsSync(SHOKUBA_CSV_PATH)) {
    console.log("職場情報CSVを読み込み、法人番号で結合中...");
    const laborRecords = loadShokubaRecords();
    const laborDataByCorporateNumber = buildLaborDataByCorporateNumber(laborRecords);
    const attachedCount = attachLaborData(regionalData, laborDataByCorporateNumber);
    console.log(`職場情報を ${attachedCount} 社に付与しました。`);
  } else {
    console.warn("職場情報CSVが見つからないため、職場情報の結合をスキップします。");
  }

  const payload: ProcessedCompaniesFile = {
    generated_at: new Date().toISOString(),
    award_master_count: loadAwardMaster().length,
    companies: flattenRegionalData(regionalData),
  };

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2));

  console.log(`processed-companies.json を出力しました: ${payload.companies.length} 社`);
}

run();