import type { Enterprise, GbizApiResponse } from "../types/gbiz";

// Leaflet はCDN経由で読み込むため、NPMパッケージを使わず型エラーを回避
declare const L: any;

// 1. 都道府県のマスターデータを定義
const PREF_MAP: Record<string, string> = {
  "01": "北海道",
  "02": "青森県",
  "03": "岩手県",
  "04": "宮城県",
  "05": "秋田県",
  "06": "山形県",
  "07": "福島県",
  "08": "茨城県",
  "09": "栃木県",
  "10": "群馬県",
  "11": "埼玉県",
  "12": "千葉県",
  "13": "東京都",
  "14": "神奈川県",
  "15": "新潟県",
  "16": "富山県",
  "17": "石川県",
  "18": "福井県",
  "19": "山梨県",
  "20": "長野県",
  "21": "岐阜県",
  "22": "静岡県",
  "23": "愛知県",
  "24": "三重県",
  "25": "滋賀県",
  "26": "京都府",
  "27": "大阪府",
  "28": "兵庫県",
  "29": "奈良県",
  "30": "和歌山県",
  "31": "鳥取県",
  "32": "島根県",
  "33": "岡山県",
  "34": "広島県",
  "35": "山口県",
  "36": "徳島県",
  "37": "香川県",
  "38": "愛媛県",
  "39": "高知県",
  "40": "福岡県",
  "41": "佐賀県",
  "42": "長崎県",
  "43": "熊本県",
  "44": "大分県",
  "45": "宮崎県",
  "46": "鹿児島県",
  "47": "沖縄県",
};

// 2. 都道府県の中心座標を定義
const PREF_COORDS: Record<string, [number, number]> = {
  "01": [43.0642, 141.3469],
  "02": [40.8243, 140.74],
  "03": [39.7036, 141.1525],
  "04": [38.2682, 140.8694],
  "05": [39.7186, 140.1024],
  "06": [38.2554, 140.3396],
  "07": [37.7503, 140.4675],
  "08": [36.3418, 140.4468],
  "09": [36.5658, 139.8836],
  "10": [36.3911, 139.0608],
  "11": [35.8569, 139.6489],
  "12": [35.6047, 140.1233],
  "13": [35.6895, 139.6917],
  "14": [35.4478, 139.6425],
  "15": [37.9162, 139.0364],
  "16": [36.6953, 137.2113],
  "17": [36.5944, 136.6256],
  "18": [36.0652, 136.2215],
  "19": [35.6635, 138.5684],
  "20": [36.6513, 138.1811],
  "21": [35.3912, 136.7223],
  "22": [34.9769, 138.3831],
  "23": [35.1802, 136.9066],
  "24": [34.7303, 136.5086],
  "25": [35.0045, 135.8686],
  "26": [35.0213, 135.7556],
  "27": [34.6937, 135.5022],
  "28": [34.6913, 135.183],
  "29": [34.6851, 135.8329],
  "30": [34.2261, 135.1675],
  "31": [35.5036, 134.2381],
  "32": [35.4723, 133.0505],
  "33": [34.6618, 133.935],
  "34": [34.3963, 132.4596],
  "35": [34.1859, 131.4706],
  "36": [34.0658, 134.5593],
  "37": [34.3401, 134.0434],
  "38": [33.8416, 132.7657],
  "39": [33.5597, 133.5311],
  "40": [33.6064, 130.4181],
  "41": [33.2494, 130.2988],
  "42": [32.7503, 129.8777],
  "43": [32.7898, 130.7417],
  "44": [33.2382, 131.6126],
  "45": [31.9111, 131.4239],
  "46": [31.5602, 130.5581],
  "47": [26.2124, 127.6809],
};

// 3. 地方グループの定義（北から順）
const REGION_GROUPS: Array<{ label: string; codes: string[] }> = [
  { label: "北海道地方", codes: ["01"] },
  { label: "東北地方", codes: ["02", "03", "04", "05", "06", "07"] },
  { label: "関東地方", codes: ["08", "09", "10", "11", "12", "13", "14"] },
  { label: "中部地方", codes: ["15", "16", "17", "18", "19", "20", "21", "22", "23"] },
  { label: "近畿地方", codes: ["24", "25", "26", "27", "28", "29", "30"] },
  { label: "中国地方", codes: ["31", "32", "33", "34", "35"] },
  { label: "四国地方", codes: ["36", "37", "38", "39"] },
  { label: "九州・沖縄地方", codes: ["40", "41", "42", "43", "44", "45", "46", "47"] },
];

// 4. 地方ごとの色定義（地方SVGと対応）
const REGION_COLORS: string[] = [
  "#a8d8ea", // 北海道
  "#c5b3e6", // 東北
  "#fcbad3", // 関東
  "#fff3a3", // 中部
  "#a8e6cf", // 近畿
  "#ffd3b6", // 中国
  "#dcedc1", // 四国
  "#ffaaa5", // 九州・沖縄
];

// 5. 地方内の都道府県グリッドレイアウト（REGION_GROUPSと対応）
type PrefCell = { code: string; col: number; row: number };
const REGION_GRID_LAYOUT: Array<{ cols: number; prefs: PrefCell[] }> = [
  // 0: 北海道地方
  { cols: 1, prefs: [{ code: "01", col: 1, row: 1 }] },
  // 1: 東北地方
  {
    cols: 2,
    prefs: [
      { code: "02", col: 2, row: 1 }, // 青森
      { code: "05", col: 1, row: 2 }, // 秋田
      { code: "03", col: 2, row: 2 }, // 岩手
      { code: "06", col: 1, row: 3 }, // 山形
      { code: "04", col: 2, row: 3 }, // 宮城
      { code: "07", col: 1, row: 4 }, // 福島
    ],
  },
  // 2: 関東地方
  {
    cols: 3,
    prefs: [
      { code: "10", col: 1, row: 1 }, // 群馬
      { code: "09", col: 2, row: 1 }, // 栃木
      { code: "08", col: 3, row: 1 }, // 茨城
      { code: "11", col: 1, row: 2 }, // 埼玉
      { code: "13", col: 2, row: 2 }, // 東京
      { code: "12", col: 3, row: 2 }, // 千葉
      { code: "14", col: 1, row: 3 }, // 神奈川
    ],
  },
  // 3: 中部地方
  {
    cols: 4,
    prefs: [
      { code: "15", col: 1, row: 1 }, // 新潟
      { code: "17", col: 1, row: 2 }, // 石川
      { code: "16", col: 2, row: 2 }, // 富山
      { code: "20", col: 3, row: 2 }, // 長野
      { code: "19", col: 4, row: 2 }, // 山梨
      { code: "18", col: 1, row: 3 }, // 福井
      { code: "21", col: 2, row: 3 }, // 岐阜
      { code: "23", col: 3, row: 3 }, // 愛知
      { code: "22", col: 4, row: 3 }, // 静岡
    ],
  },
  // 4: 近畿地方
  {
    cols: 3,
    prefs: [
      { code: "25", col: 2, row: 1 }, // 滋賀
      { code: "26", col: 3, row: 1 }, // 京都
      { code: "27", col: 1, row: 2 }, // 大阪
      { code: "29", col: 2, row: 2 }, // 奈良
      { code: "28", col: 3, row: 2 }, // 兵庫
      { code: "30", col: 1, row: 3 }, // 和歌山
      { code: "24", col: 2, row: 3 }, // 三重
    ],
  },
  // 5: 中国地方
  {
    cols: 3,
    prefs: [
      { code: "32", col: 2, row: 1 }, // 島根
      { code: "31", col: 3, row: 1 }, // 鳥取
      { code: "35", col: 1, row: 2 }, // 山口
      { code: "34", col: 2, row: 2 }, // 広島
      { code: "33", col: 3, row: 2 }, // 岡山
    ],
  },
  // 6: 四国地方
  {
    cols: 2,
    prefs: [
      { code: "38", col: 1, row: 1 }, // 愛媛
      { code: "37", col: 2, row: 1 }, // 香川
      { code: "39", col: 1, row: 2 }, // 高知
      { code: "36", col: 2, row: 2 }, // 徳島
    ],
  },
  // 7: 九州・沖縄地方
  {
    cols: 4,
    prefs: [
      { code: "42", col: 1, row: 1 }, // 長崎
      { code: "41", col: 2, row: 1 }, // 佐賀
      { code: "40", col: 3, row: 1 }, // 福岡
      { code: "44", col: 4, row: 1 }, // 大分
      { code: "43", col: 2, row: 2 }, // 熊本
      { code: "45", col: 4, row: 2 }, // 宮崎
      { code: "46", col: 2, row: 3 }, // 鹿児島
      { code: "47", col: 1, row: 4 }, // 沖縄
    ],
  },
];

class LocalStarsApp {
  private selector: HTMLSelectElement;
  private container: HTMLDivElement;
  private map: any = null;
  private markers: any[] = [];

  constructor() {
    this.selector = document.getElementById("pref-selector") as HTMLSelectElement;
    this.container = document.getElementById("list-container") as HTMLDivElement;

    this.initSelector();
    this.initVisualMap();
    this.bindEvents();
  }

  private initSelector() {
    for (const region of REGION_GROUPS) {
      const group = document.createElement("optgroup");
      group.label = region.label;
      for (const code of region.codes) {
        const name = PREF_MAP[code];
        if (!name) continue;
        const option = document.createElement("option");
        option.value = code;
        option.textContent = name;
        group.appendChild(option);
      }
      this.selector.appendChild(group);
    }
  }

  private showMap(code: string) {
    const coords = PREF_COORDS[code];
    if (!coords) return;
    const mapEl = document.getElementById("map") as HTMLElement;
    mapEl.hidden = false;
    if (this.map === null) {
      this.map = L.map("map").setView(coords, 10);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);
    } else {
      this.map.flyTo(coords, 10);
    }
  }

  private clearMarkers() {
    for (const marker of this.markers) marker.remove();
    this.markers = [];
  }

  private initVisualMap() {
    // 地方ブロッククリック
    document.querySelectorAll<SVGGElement>(".region-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        this.showPrefGrid(idx);
      });
    });
    // 地方一覧に戻るボタン
    document.getElementById("back-to-regions")?.addEventListener("click", () => {
      (document.getElementById("pref-grid-view") as HTMLElement).hidden = true;
      (document.getElementById("region-view") as HTMLElement).hidden = false;
    });
  }

  private showPrefGrid(regionIdx: number) {
    const region = REGION_GROUPS[regionIdx];
    const layout = REGION_GRID_LAYOUT[regionIdx];
    const color = REGION_COLORS[regionIdx] ?? "#d0e8ff";
    (document.getElementById("region-view") as HTMLElement).hidden = true;
    const prefGridView = document.getElementById("pref-grid-view") as HTMLElement;
    prefGridView.hidden = false;
    const label = document.getElementById("selected-region-name") as HTMLElement;
    label.textContent = region.label;

    const CELL_W = 80;
    const CELL_H = 52;
    const GAP = 6;
    const PAD = 10;
    const maxRow = Math.max(...layout.prefs.map((p) => p.row));
    const svgW = layout.cols * (CELL_W + GAP) - GAP + PAD * 2;
    const svgH = maxRow * (CELL_H + GAP) - GAP + PAD * 2;

    const NS = "http://www.w3.org/2000/svg";
    const svgEl = document.createElementNS(NS, "svg");
    svgEl.setAttribute("id", "pref-svg");
    svgEl.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);
    svgEl.setAttribute("role", "group");
    svgEl.setAttribute("aria-label", region.label);

    for (const cell of layout.prefs) {
      const x = PAD + (cell.col - 1) * (CELL_W + GAP);
      const y = PAD + (cell.row - 1) * (CELL_H + GAP);
      const name = (PREF_MAP[cell.code] ?? cell.code).replace(/[都道府県]$/, "");
      const isSelected = cell.code === this.selector.value;

      const g = document.createElementNS(NS, "g");
      g.setAttribute("class", `pref-cell${isSelected ? " selected" : ""}`);
      g.setAttribute("data-code", cell.code);
      g.setAttribute("role", "button");
      g.setAttribute("tabindex", "0");
      g.setAttribute("aria-label", PREF_MAP[cell.code] ?? cell.code);
      g.setAttribute("aria-pressed", String(isSelected));

      const rect = document.createElementNS(NS, "rect");
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(y));
      rect.setAttribute("width", String(CELL_W));
      rect.setAttribute("height", String(CELL_H));
      rect.setAttribute("rx", "8");
      rect.setAttribute("fill", isSelected ? "var(--primary-color)" : color);
      rect.dataset.baseColor = color;

      const text = document.createElementNS(NS, "text");
      text.setAttribute("x", String(x + CELL_W / 2));
      text.setAttribute("y", String(y + CELL_H / 2 + 5));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", isSelected ? "white" : "#333");
      text.textContent = name;

      g.appendChild(rect);
      g.appendChild(text);
      g.addEventListener("click", () => this.selectPrefecture(cell.code));
      g.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") this.selectPrefecture(cell.code);
      });
      svgEl.appendChild(g);
    }

    const grid = document.getElementById("pref-grid") as HTMLElement;
    grid.innerHTML = "";
    grid.appendChild(svgEl);
  }

  private selectPrefecture(code: string) {
    this.selector.value = code;
    // SVGの pref-cell の選択状態を更新
    document.querySelectorAll<SVGGElement>(".pref-cell").forEach((g) => {
      const selected = g.dataset.code === code;
      g.classList.toggle("selected", selected);
      g.setAttribute("aria-pressed", String(selected));
      const rect = g.querySelector("rect");
      const text = g.querySelector("text");
      if (rect) rect.setAttribute("fill", selected ? "var(--primary-color)" : (rect.dataset.baseColor ?? "#d0e8ff"));
      if (text) text.setAttribute("fill", selected ? "white" : "#333");
    });
    this.showMap(code);
    this.fetchData(code);
  }

  private bindEvents() {
    this.selector.addEventListener("change", () => {
      const code = this.selector.value;
      if (!code) return;
      this.showMap(code);
      this.fetchData(code);
    });
  }

  private async fetchData(code: string) {
    this.container.innerHTML = '<p class="loading">読み込み中...</p>';
    try {
      // GitHub Pagesの docs/data/05.json を正しく参照します
      const res = await fetch(`./data/${code}.json`);

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = (await res.json()) as GbizApiResponse;
      this.render(data["hojin-infos"]);
    } catch (e) {
      console.error(e);
      this.container.innerHTML =
        '<p class="error">データの取得に失敗しました。まだデータが準備されていない可能性があります。</p>';
    }
  }

  private render(companies: Enterprise[]) {
    this.clearMarkers();

    if (companies.length === 0) {
      this.container.innerHTML = "<p>該当する企業はありません。</p>";
      return;
    }

    this.container.innerHTML = companies
      .map(
        (c) => `
      <div class="company-card">
        <h3 class="company-name">${c.name}</h3>
        <p class="address">📍 <a href="https://maps.google.com/maps?q=${encodeURIComponent(c.address)}" target="_blank" rel="noopener noreferrer">${c.address}</a></p>
        <div class="certification-tags">
          ${c.certification.map((cert) => `<span class="tag">${cert.certification_name}</span>`).join("")}
        </div>
      </div>
    `,
      )
      .join("");

    // 座標を持つ企業にマーカーを追加
    if (this.map !== null) {
      for (const c of companies) {
        if (c.lat !== undefined && c.lng !== undefined) {
          // 同一都市のマーカー重複を避けるため微小オフセットを付与
          const jitter = () => (Math.random() - 0.5) * 0.02;
          const marker = L.marker([c.lat + jitter(), c.lng + jitter()])
            .addTo(this.map)
            .bindPopup(`<strong>${c.name}</strong><br><small>${c.address}</small>`);
          this.markers.push(marker);
        }
      }
    }
  }
}

window.addEventListener("DOMContentLoaded", () => new LocalStarsApp());
