import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { AwardMaster, AwardMasterFile } from "../types/award-master";

const AWARD_MASTER_PATH = join(import.meta.dir, "./award-master.json");
const YEAR_PATTERN = /(?:令和|平成|昭和)[0-9０-９元]+年度?|[0-9０-９]{4}年度?|[0-9０-９]{4}年/g;
const ROUND_PATTERN = /第[0-9０-９]+回/g;
const SYMBOL_PATTERN = /[「」『』【】［］\[\]（）()]/g;
const SEPARATOR_PATTERN = /[\s\-_‐‑‒–—―ー・･]/g;

let cachedAwardMaster: AwardMaster[] | null = null;

function normalizeText(value: string): string {
  return value.normalize("NFKC").trim();
}

export function normalizeAwardName(value: string): string {
  return normalizeText(value)
    .replaceAll(YEAR_PATTERN, "")
    .replaceAll(ROUND_PATTERN, "")
    .replaceAll(SYMBOL_PATTERN, "")
    .replaceAll(SEPARATOR_PATTERN, "")
    .trim();
}

function tokenizeAwardName(value: string): string[] {
  return normalizeText(value)
    .split(/[\s\-_/・･:：]+/)
    .map((token) => normalizeAwardName(token))
    .filter((token) => token.length >= 2);
}

function calculateMatchScore(sourceName: string, masterName: string): number {
  const normalizedSource = normalizeAwardName(sourceName);
  const normalizedMaster = normalizeAwardName(masterName);

  if (!normalizedSource || !normalizedMaster) return -1;
  if (normalizedSource === normalizedMaster) return 300 + normalizedMaster.length;
  if (normalizedSource.includes(normalizedMaster)) return 200 + normalizedMaster.length;
  if (normalizedMaster.includes(normalizedSource)) return 120 + normalizedSource.length;

  const sourceTokens = tokenizeAwardName(sourceName);
  const masterTokens = tokenizeAwardName(masterName);
  const matchedLength = masterTokens.reduce((total, token) => {
    const hasMatch = sourceTokens.some((sourceToken) => sourceToken.includes(token) || token.includes(sourceToken));
    return hasMatch ? total + token.length : total;
  }, 0);

  if (matchedLength === 0) return -1;

  const coverage = matchedLength / normalizedMaster.length;
  return coverage >= 0.55 ? 50 + Math.round(coverage * 100) : -1;
}

export function loadAwardMaster(): AwardMaster[] {
  if (cachedAwardMaster) return cachedAwardMaster;

  const raw = readFileSync(AWARD_MASTER_PATH, "utf-8");
  const parsed = JSON.parse(raw) as AwardMasterFile;
  cachedAwardMaster = parsed.awards;
  return cachedAwardMaster;
}

export function findAwardMasterByName(name: string, awardMaster = loadAwardMaster()): AwardMaster | undefined {
  let bestMatch: AwardMaster | undefined;
  let bestScore = -1;

  for (const master of awardMaster) {
    const score = calculateMatchScore(name, master.name);
    if (score <= bestScore) continue;
    bestScore = score;
    bestMatch = master;
  }

  return bestScore >= 0 ? bestMatch : undefined;
}
