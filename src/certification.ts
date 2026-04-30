const OTHER_GENRE = "その他";

export const CERTIFICATION_GENRE_ORDER = [
  "女性活躍支援",
  "子育て支援",
  "健康経営",
  "働き方改革",
  "障害者雇用",
  "IT活用・知財",
  "環境・サステナビリティ",
  "物流・交通",
  "地域産業・社会貢献",
  OTHER_GENRE,
] as const;

export type CertificationGenre = (typeof CERTIFICATION_GENRE_ORDER)[number];

export interface CertificationSource {
  certificationName: string;
  issuer?: string;
  target?: string;
  division?: string;
}

function includesAny(source: string, keywords: string[]): boolean {
  return keywords.some((keyword) => source.includes(keyword));
}

function normalizeValue(value: string | undefined): string {
  return (value ?? "").trim();
}

export function classifyCertificationGenre(source: CertificationSource): CertificationGenre {
  const certificationName = normalizeValue(source.certificationName);
  const issuer = normalizeValue(source.issuer);
  const target = normalizeValue(source.target);
  const division = normalizeValue(source.division);
  const textSource = `${certificationName} ${target} ${division}`;
  const combined = `${textSource} ${issuer}`;

  if (includesAny(textSource, ["えるぼし", "女性活躍", "なでしこ"])) {
    return "女性活躍支援";
  }
  if (includesAny(textSource, ["くるみん", "子育て", "次世代育成"])) {
    return "子育て支援";
  }
  if (includesAny(textSource, ["健康経営"])) {
    return "健康経営";
  }
  if (includesAny(textSource, ["テレワーク", "働き方改革", "グッドキャリア", "無期転換"])) {
    return "働き方改革";
  }
  if (includesAny(textSource, ["生涯学習", "青少年", "人権", "まちづくり", "地域未来", "農業", "輸出"])) {
    return "地域産業・社会貢献";
  }
  if (includesAny(textSource, ["障害者雇用", "障害者"])) {
    return "障害者雇用";
  }
  if (includesAny(textSource, ["IT", "ＩＴ", "DX", "デジタル", "知財", "特許"])) {
    return "IT活用・知財";
  }
  if (includesAny(textSource, ["環境", "グリーン", "食品ロス", "緑化", "グッドライフ", "持続可能", "サステナ"])) {
    return "環境・サステナビリティ";
  }
  if (includesAny(textSource, ["物流", "輸送", "運輸", "交通"])) {
    return "物流・交通";
  }
  if (includesAny(textSource, ["社会", "地域"])) {
    return "地域産業・社会貢献";
  }
  if (issuer.includes("厚生労働省") && includesAny(combined, ["表彰", "認定", "銘柄"])) {
    return "働き方改革";
  }
  if (includesAny(issuer, ["気象庁", "国土交通省", "防衛省", "環境省", "農林水産省", "経済産業省"])) {
    return "地域産業・社会貢献";
  }

  return OTHER_GENRE;
}

export function normalizeCertificationGenreLabel(genre: string | undefined): string {
  return genre && genre.trim() ? genre : OTHER_GENRE;
}
