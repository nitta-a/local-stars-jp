import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { normalize } from "@geolonia/normalize-japanese-addresses";
import type { Enterprise, GbizApiResponse } from "../types/gbiz";
import { OUTPUT_DIR } from "./constants";

export type AddrCache = Map<string, { lat: number; lng: number }>;

export function loadGeoCache(regionalData: Map<string, Map<string, Enterprise>>): AddrCache {
  const addrCache: AddrCache = new Map();
  for (const [code] of regionalData.entries()) {
    const outPath = join(OUTPUT_DIR, `${code}.json`);
    if (!existsSync(outPath)) continue;
    try {
      const existing = JSON.parse(readFileSync(outPath, "utf-8")) as GbizApiResponse;
      for (const company of existing["hojin-infos"]) {
        if (company.lat !== undefined && company.lng !== undefined) {
          addrCache.set(company.address, { lat: company.lat, lng: company.lng });
        }
      }
    } catch {
      // 読み込み失敗は無視して再取得
    }
  }
  return addrCache;
}

export async function geocodeAddresses(addrs: string[]): Promise<AddrCache> {
  const addrCache: AddrCache = new Map();
  for (let i = 0; i < addrs.length; i++) {
    const addr = addrs[i];
    try {
      const result = await normalize(addr);
      const point = result.point;
      if (point) {
        addrCache.set(addr, { lat: point.lat, lng: point.lng });
      }
      // point が null の場合はキャッシュしない（次回実行時に再試行）
    } catch {
      // 失敗した住所はキャッシュしない（次回実行時に再試行）
    }
    if ((i + 1) % 100 === 0) {
      console.log(`  ${i + 1}/${addrs.length} 完了`);
    }
  }
  return addrCache;
}

export function applyCoords(regionalData: Map<string, Map<string, Enterprise>>, addrCache: AddrCache): void {
  for (const prefMap of regionalData.values()) {
    for (const company of prefMap.values()) {
      const coord = addrCache.get(company.address);
      if (coord) {
        company.lat = coord.lat;
        company.lng = coord.lng;
      }
    }
  }
}
