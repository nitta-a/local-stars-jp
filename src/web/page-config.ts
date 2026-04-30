export type PageConfig = {
  assetBase: string;
  fixedPrefCode: string;
  isFixedPrefPage: boolean;
};

function normalizeAssetBase(value: string | undefined): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    return ".";
  }

  if (trimmed === "/") {
    return "/";
  }

  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

export function getPageConfig(): PageConfig {
  const root = document.documentElement;
  const assetBase = normalizeAssetBase(root.dataset.assetBase);
  const fixedPrefCode = (root.dataset.prefCode ?? "").trim();

  return {
    assetBase,
    fixedPrefCode,
    isFixedPrefPage: fixedPrefCode.length > 0,
  };
}

export function resolveAssetPath(pathFromDocsRoot: string): string {
  const relativePath = pathFromDocsRoot.replace(/^\/+/, "");
  const { assetBase } = getPageConfig();

  if (assetBase === "/") {
    return `/${relativePath}`;
  }

  if (assetBase === ".") {
    return `./${relativePath}`;
  }

  return `${assetBase}/${relativePath}`;
}

export function buildPrefecturePagePath(code: string): string {
  const { isFixedPrefPage } = getPageConfig();
  return isFixedPrefPage ? `../${code}/` : `./pref/${code}/`;
}
