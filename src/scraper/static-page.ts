import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ALL_PREFS } from "./constants";

const DOCS_DIR = join(import.meta.dir, "../../docs");
const INDEX_TEMPLATE_PATH = join(DOCS_DIR, "index.html");
const PREF_OUTPUT_DIR = join(DOCS_DIR, "pref");
const SITEMAP_OUTPUT_PATH = join(DOCS_DIR, "sitemap.xml");
const SITE_URL = "https://nitta-a.github.io/local-stars-jp";

export type PrefecturePageSummary = {
  code: string;
  name: string;
  companyCount: number;
};

function escapeHtmlAttr(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

function buildPageTitle(prefName: string): string {
  return `${prefName}の優良認定企業を地図で検索 | Local Stars JP`;
}

function buildPageDescription(prefName: string, companyCount: number): string {
  const countText = companyCount > 0 ? `${companyCount}社の` : "";
  return `${prefName}の${countText}ユースエール、えるぼし、くるみん、健康経営優良法人などの認定企業を地図と一覧で検索できます。gBizINFOのオープンデータを活用した無料の企業情報サービスです。`;
}

function injectSeoAndConfig(template: string, summary: PrefecturePageSummary): string {
  const canonicalUrl = `${SITE_URL}/pref/${summary.code}/`;
  const title = buildPageTitle(summary.name);
  const description = buildPageDescription(summary.name, summary.companyCount);

  return template
    .replace(
      '<html lang="ja">',
      `<html lang="ja" data-asset-base="../.." data-pref-code="${escapeHtmlAttr(summary.code)}">`,
    )
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*">/,
      `<meta name="description" content="${escapeHtmlAttr(description)}">`,
    )
    .replace(
      /<meta property="og:title" content="[^"]*">/,
      `<meta property="og:title" content="${escapeHtmlAttr(title)}">`,
    )
    .replace(
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${escapeHtmlAttr(description)}">`,
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*">/,
      `<meta name="twitter:title" content="${escapeHtmlAttr(title)}">`,
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*">/,
      `<meta name="twitter:description" content="${escapeHtmlAttr(description)}">`,
    )
    .replace(
      '    <meta name="robots" content="index, follow">\n',
      `    <meta name="robots" content="index, follow">\n    <link rel="canonical" href="${canonicalUrl}">\n`,
    )
    .replace(
      '    <meta property="og:site_name" content="Local Stars JP">\n',
      `    <meta property="og:site_name" content="Local Stars JP">\n    <meta property="og:url" content="${canonicalUrl}">\n`,
    )
    .replaceAll('href="favicon.svg"', 'href="../../favicon.svg"')
    .replaceAll('href="style.css"', 'href="../../style.css"')
    .replace(
      '    <script type="module" src="app.js"></script>',
      '    <script type="module" src="../../app.js"></script>',
    );
}

export function buildPrefecturePageSummaries(countsByCode: Map<string, number>): PrefecturePageSummary[] {
  return Object.entries(ALL_PREFS)
    .map(([name, code]) => ({
      code,
      name,
      companyCount: countsByCode.get(code) ?? 0,
    }))
    .sort((left, right) => left.code.localeCompare(right.code));
}

export function writePrefecturePages(summaries: PrefecturePageSummary[]): void {
  const template = readFileSync(INDEX_TEMPLATE_PATH, "utf8");
  mkdirSync(PREF_OUTPUT_DIR, { recursive: true });

  for (const summary of summaries) {
    const outputDir = join(PREF_OUTPUT_DIR, summary.code);
    mkdirSync(outputDir, { recursive: true });
    writeFileSync(join(outputDir, "index.html"), injectSeoAndConfig(template, summary));
  }

  console.log(`- 都道府県別HTMLを出力完了: ${summaries.length} ページ`);
}

export function writeSitemap(summaries: PrefecturePageSummary[]): void {
  const lastmod = new Date().toISOString();
  const urls = [
    `  <url>\n    <loc>${SITE_URL}/</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    ...summaries.map(
      (summary) =>
        `  <url>\n    <loc>${SITE_URL}/pref/${summary.code}/</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    ),
  ].join("\n");

  writeFileSync(
    SITEMAP_OUTPUT_PATH,
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );

  console.log(`- sitemap.xml を更新完了: ${summaries.length + 1} URL`);
}
