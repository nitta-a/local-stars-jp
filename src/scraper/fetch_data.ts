import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Enterprise, GbizApiResponse } from "../types/gbiz";

/**
 * gBizINFO API v2 設定
 */
const API_TOKEN = process.env.GBIZ_API_KEY || "";
const BASE_URL = "https://api.info.gbiz.go.jp/hojin/v2/hojin";
const init = { method: "GET", headers: { Accept: "application/json", "X-hojinInfo-api-token": API_TOKEN } };

/**
 * APIから取得した生データを、フロントエンドに必要な最小限の形に整える
 */
function simplifyData(rawData: any): GbizApiResponse {
  const hojinInfos = rawData["hojin-infos"] || [];

  const simplifiedInfos: Enterprise[] = hojinInfos.map((info: any) => ({
    corporate_number: info.corporate_number,
    name: info.name,
    address: info.address,
    prefecture: info.prefecture,
    certification: (info.certification || []).map((cert: any) => ({
      certification_name: cert.certification_name,
      certified_date: cert.certified_date,
    })),
  }));

  return { "hojin-infos": simplifiedInfos };
}

/**
 * 指定した都道府県のデータを取得して保存する
 */
async function fetchAndSaveByPref(prefCode: string) {
  if (!API_TOKEN) {
    console.error("エラー: GBIZ_API_KEY が設定されていません。");
    return;
  }

  console.log(`開始: 都道府県コード ${prefCode} のデータを取得中...`);

  const limit = 1000; // APIの1回のリクエストでの最大取得件数
  // v2 APIのパラメータ設定
  const params = new URLSearchParams({ prefecture: prefCode, limit: limit.toString() });
  const url = `${BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, init);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`APIリクエスト失敗 (${response.status}): ${errorText}`);
    }

    const rawData = await response.json();

    // データのクレンジング
    const cleanData = simplifyData(rawData);

    // 保存先ディレクトリの準備 (public/data)
    const dirPath = join(import.meta.dir, "../../public/data");
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    // JSONとして保存
    const filePath = join(dirPath, `${prefCode}.json`);
    writeFileSync(filePath, JSON.stringify(cleanData, null, 2));

    console.log(`成功: ${filePath} に ${cleanData["hojin-infos"].length} 件のデータを保存しました。`);
  } catch (error) {
    console.error(`失敗: 都道府県コード ${prefCode} の処理中にエラーが発生しました:`, error);
    process.exit(1); // Actionsで失敗を検知できるように終了コードを出す
  }
}

/**
 * メイン実行処理
 * 引数があればそのコードを、なければデフォルトで秋田(05)を取得
 */
const targetPref = process.argv[2] || "05";
fetchAndSaveByPref(targetPref);
