// src/certification.ts
var OTHER_GENRE = "その他";
var CERTIFICATION_GENRE_ORDER = [
  "女性活躍支援",
  "子育て支援",
  "健康経営",
  "働き方改革",
  "障害者雇用",
  "IT活用・知財",
  "環境・サステナビリティ",
  "物流・交通",
  "地域産業・社会貢献",
  OTHER_GENRE
];
function normalizeCertificationGenreLabel(genre) {
  return genre && genre.trim() ? genre : OTHER_GENRE;
}

// src/web/constants.ts
var PREF_MAP = {
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
  "47": "沖縄県"
};
var PREF_COORDS = {
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
  "47": [26.2124, 127.6809]
};
var REGION_GROUPS = [
  { label: "北海道", codes: ["01"] },
  { label: "東北", codes: ["02", "03", "04", "05", "06", "07"] },
  { label: "関東", codes: ["08", "09", "10", "11", "12", "13", "14"] },
  { label: "中部", codes: ["15", "16", "17", "18", "19", "20", "21", "22", "23"] },
  { label: "近畿", codes: ["24", "25", "26", "27", "28", "29", "30"] },
  { label: "中国", codes: ["31", "32", "33", "34", "35"] },
  { label: "四国", codes: ["36", "37", "38", "39"] },
  { label: "九州・沖縄", codes: ["40", "41", "42", "43", "44", "45", "46", "47"] }
];
var REGION_COLORS = [
  "#a8d8ea",
  "#c5b3e6",
  "#fcbad3",
  "#fff3a3",
  "#a8e6cf",
  "#ffd3b6",
  "#dcedc1",
  "#ffaaa5"
];
var REGION_GRID_LAYOUT = [
  { cols: 1, prefs: [{ code: "01", col: 1, row: 1 }] },
  {
    cols: 2,
    prefs: [
      { code: "02", col: 2, row: 1 },
      { code: "05", col: 1, row: 2 },
      { code: "03", col: 2, row: 2 },
      { code: "06", col: 1, row: 3 },
      { code: "04", col: 2, row: 3 },
      { code: "07", col: 1, row: 4 }
    ]
  },
  {
    cols: 3,
    prefs: [
      { code: "10", col: 1, row: 1 },
      { code: "09", col: 2, row: 1 },
      { code: "08", col: 3, row: 1 },
      { code: "11", col: 1, row: 2 },
      { code: "13", col: 2, row: 2 },
      { code: "12", col: 3, row: 2 },
      { code: "14", col: 1, row: 3 }
    ]
  },
  {
    cols: 4,
    prefs: [
      { code: "15", col: 1, row: 1 },
      { code: "17", col: 1, row: 2 },
      { code: "16", col: 2, row: 2 },
      { code: "20", col: 3, row: 2 },
      { code: "19", col: 4, row: 2 },
      { code: "18", col: 1, row: 3 },
      { code: "21", col: 2, row: 3 },
      { code: "23", col: 3, row: 3 },
      { code: "22", col: 4, row: 3 }
    ]
  },
  {
    cols: 3,
    prefs: [
      { code: "25", col: 2, row: 1 },
      { code: "26", col: 3, row: 1 },
      { code: "27", col: 1, row: 2 },
      { code: "29", col: 2, row: 2 },
      { code: "28", col: 3, row: 2 },
      { code: "30", col: 1, row: 3 },
      { code: "24", col: 2, row: 3 }
    ]
  },
  {
    cols: 3,
    prefs: [
      { code: "32", col: 2, row: 1 },
      { code: "31", col: 3, row: 1 },
      { code: "35", col: 1, row: 2 },
      { code: "34", col: 2, row: 2 },
      { code: "33", col: 3, row: 2 }
    ]
  },
  {
    cols: 2,
    prefs: [
      { code: "38", col: 1, row: 1 },
      { code: "37", col: 2, row: 1 },
      { code: "39", col: 1, row: 2 },
      { code: "36", col: 2, row: 2 }
    ]
  },
  {
    cols: 4,
    prefs: [
      { code: "42", col: 1, row: 1 },
      { code: "41", col: 2, row: 1 },
      { code: "40", col: 3, row: 1 },
      { code: "44", col: 4, row: 1 },
      { code: "43", col: 2, row: 2 },
      { code: "45", col: 4, row: 2 },
      { code: "46", col: 2, row: 3 },
      { code: "47", col: 1, row: 4 }
    ]
  }
];

// src/web/map.ts
var TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
var TILE_ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "./images/marker-icon.png",
  iconRetinaUrl: "./images/marker-icon-2x.png",
  shadowUrl: "./images/marker-shadow.png"
});

class MapController {
  map = null;
  markerLayer = null;
  showMap(code) {
    const coords = PREF_COORDS[code];
    if (!coords)
      return;
    const mapEl = document.getElementById("map");
    mapEl.hidden = false;
    if (this.map === null) {
      this.map = L.map("map").setView(coords, 10);
      L.tileLayer(TILE_URL, { maxZoom: 18, attribution: TILE_ATTRIBUTION }).addTo(this.map);
    } else {
      this.map.flyTo(coords, 10);
    }
    this.map.invalidateSize();
  }
  clearMarkers() {
    this.markerLayer?.clearLayers();
  }
  updateMarkers(companies) {
    if (this.map === null)
      return;
    if (this.markerLayer === null) {
      this.markerLayer = L.layerGroup().addTo(this.map);
    }
    this.markerLayer.clearLayers();
    for (const c of companies) {
      if (c.lat !== undefined && c.lng !== undefined) {
        const tags = c.certification.map((cert) => `<span class="popup-tag">${escapeHtml(cert.certification_name)}</span>`).join("");
        L.marker([c.lat, c.lng]).bindPopup(`<strong>${escapeHtml(c.name)}</strong><br><small>${escapeHtml(c.address)}</small>${tags ? `<div class="popup-tags">${tags}</div>` : ""}`).addTo(this.markerLayer);
      }
    }
  }
}

// src/web/renderer.ts
function escapeHtml2(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function buildCertificationTags(c) {
  return c.certification.map((cert) => `<span class="tag">${escapeHtml2(cert.certification_name)}</span>`).join("");
}
function buildCompanyCardHtml(c) {
  const escapedName = escapeHtml2(c.name);
  const escapedAddress = escapeHtml2(c.address);
  const corporateNumber = escapeHtml2(c.corporate_number);
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(c.address)}`;
  return `
      <div class="company-card">
        <div class="company-card__eyebrow">
          <span class="company-card__badge">認定 ${c.certification.length} 件</span>
          <span class="corporate-number">法人番号 ${corporateNumber}</span>
        </div>
        <h3 class="company-name">${escapedName}</h3>
        <p class="address">所在地 <a href="${mapUrl}" target="_blank" rel="noopener noreferrer">${escapedAddress}</a></p>
        <div class="certification-tags">
          ${buildCertificationTags(c)}
        </div>
        <div class="links">
          <a href="${mapUrl}" target="_blank" rel="noopener noreferrer">Google マップで見る</a>
        </div>
      </div>
    `;
}
function buildCompanyCardCompactHtml(c) {
  const escapedName = escapeHtml2(c.name);
  const escapedAddress = escapeHtml2(c.address);
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(c.address)}`;
  return `
      <div class="company-card company-card--compact">
        <div class="company-card__compact-main">
          <span class="company-name">${escapedName}</span>
          <span class="company-card__compact-address">${escapedAddress}</span>
        </div>
        <div class="certification-tags">
          ${buildCertificationTags(c)}
        </div>
        <div class="links">
          <a href="${mapUrl}" target="_blank" rel="noopener noreferrer">地図</a>
        </div>
      </div>
    `;
}
var SVG_NS = "http://www.w3.org/2000/svg";
var CELL_W = 80;
var CELL_H = 52;
var GAP = 6;
var PAD = 10;
function buildPrefSvg(regionIdx, selectedCode, onSelect) {
  const region = REGION_GROUPS[regionIdx];
  const layout = REGION_GRID_LAYOUT[regionIdx];
  const color = REGION_COLORS[regionIdx] ?? "#d0e8ff";
  const maxRow = Math.max(...layout.prefs.map((p) => p.row));
  const svgW = layout.cols * (CELL_W + GAP) - GAP + PAD * 2;
  const svgH = maxRow * (CELL_H + GAP) - GAP + PAD * 2;
  const svgEl = document.createElementNS(SVG_NS, "svg");
  svgEl.setAttribute("id", "pref-svg");
  svgEl.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);
  svgEl.setAttribute("role", "group");
  svgEl.setAttribute("aria-label", region.label);
  for (const cell of layout.prefs) {
    const x = PAD + (cell.col - 1) * (CELL_W + GAP);
    const y = PAD + (cell.row - 1) * (CELL_H + GAP);
    const name = PREF_MAP[cell.code] ?? cell.code;
    const isSelected = cell.code === selectedCode;
    const g = document.createElementNS(SVG_NS, "g");
    g.setAttribute("class", `pref-cell${isSelected ? " selected" : ""}`);
    g.setAttribute("data-code", cell.code);
    g.setAttribute("role", "button");
    g.setAttribute("tabindex", "0");
    g.setAttribute("aria-label", name);
    g.setAttribute("aria-pressed", String(isSelected));
    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("width", String(CELL_W));
    rect.setAttribute("height", String(CELL_H));
    rect.setAttribute("rx", "8");
    rect.setAttribute("fill", isSelected ? "var(--primary-color)" : color);
    rect.dataset.baseColor = color;
    const text = document.createElementNS(SVG_NS, "text");
    text.setAttribute("x", String(x + CELL_W / 2));
    text.setAttribute("y", String(y + CELL_H / 2 + 5));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", isSelected ? "white" : "#333");
    text.textContent = name;
    g.appendChild(rect);
    g.appendChild(text);
    g.addEventListener("click", () => onSelect(cell.code));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ")
        onSelect(cell.code);
    });
    svgEl.appendChild(g);
  }
  return svgEl;
}

// src/web/app.ts
var LOADING_MSG = "読み込み中...";
var ERR_NO_DATA = "データの取得に失敗しました。まだデータが準備されていない可能性があります。";
var ERR_NO_COMPANIES = "該当する企業はありません。";
function escapeHtml3(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

class LocalStarsApp {
  selector;
  container;
  filterInput;
  certFilter;
  filterWrap;
  viewToggleCard;
  viewToggleCompact;
  selectionTitle;
  selectionSummary;
  resultsTitle;
  resultsMeta;
  resultsCount;
  mapCtrl = new MapController;
  allCompanies = [];
  viewMode = "card";
  selectedCode = "";
  constructor() {
    this.selector = document.getElementById("pref-selector");
    this.container = document.getElementById("list-container");
    this.filterInput = document.getElementById("name-filter");
    this.certFilter = document.getElementById("cert-filter");
    this.filterWrap = document.getElementById("name-filter-wrap");
    this.viewToggleCard = document.getElementById("view-toggle-card");
    this.viewToggleCompact = document.getElementById("view-toggle-compact");
    this.selectionTitle = document.getElementById("selection-title");
    this.selectionSummary = document.getElementById("selection-summary");
    this.resultsTitle = document.getElementById("results-title");
    this.resultsMeta = document.getElementById("results-meta");
    this.resultsCount = document.getElementById("results-count");
    this.initSelector();
    this.initVisualMap();
    this.initTabs();
    this.bindEvents();
    this.renderInitialState();
  }
  initSelector() {
    for (const region of REGION_GROUPS) {
      const group = document.createElement("optgroup");
      group.label = region.label;
      for (const code of region.codes) {
        const name = PREF_MAP[code];
        if (!name)
          continue;
        const option = document.createElement("option");
        option.value = code;
        option.textContent = name;
        group.appendChild(option);
      }
      this.selector.appendChild(group);
    }
  }
  initVisualMap() {
    document.querySelectorAll(".region-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        this.showPrefGrid(idx);
      });
    });
    document.getElementById("back-to-regions")?.addEventListener("click", () => {
      document.getElementById("pref-grid-view").hidden = true;
      document.getElementById("region-view").hidden = false;
    });
  }
  initTabs() {
    const tabMap = document.getElementById("tab-btn-map");
    const tabList = document.getElementById("tab-btn-list");
    const panelMap = document.getElementById("tab-panel-map");
    const panelList = document.getElementById("tab-panel-list");
    tabMap.addEventListener("click", () => {
      tabMap.classList.add("active");
      tabMap.setAttribute("aria-selected", "true");
      tabList.classList.remove("active");
      tabList.setAttribute("aria-selected", "false");
      panelMap.hidden = false;
      panelList.hidden = true;
    });
    tabList.addEventListener("click", () => {
      tabList.classList.add("active");
      tabList.setAttribute("aria-selected", "true");
      tabMap.classList.remove("active");
      tabMap.setAttribute("aria-selected", "false");
      panelList.hidden = false;
      panelMap.hidden = true;
    });
  }
  showPrefGrid(regionIdx) {
    const region = REGION_GROUPS[regionIdx];
    if (region.codes.length === 1) {
      this.selectPrefecture(region.codes[0]);
      return;
    }
    document.getElementById("region-view").hidden = true;
    const prefGridView = document.getElementById("pref-grid-view");
    prefGridView.hidden = false;
    document.getElementById("selected-region-name").textContent = region.label;
    const svgEl = buildPrefSvg(regionIdx, this.selector.value, (code) => this.selectPrefecture(code));
    const grid = document.getElementById("pref-grid");
    grid.innerHTML = "";
    grid.appendChild(svgEl);
  }
  selectPrefecture(code) {
    this.selectedCode = code;
    this.selector.value = code;
    document.querySelectorAll(".pref-cell").forEach((g) => {
      const selected = g.dataset.code === code;
      g.classList.toggle("selected", selected);
      g.setAttribute("aria-pressed", String(selected));
      const rect = g.querySelector("rect");
      const text = g.querySelector("text");
      if (rect)
        rect.setAttribute("fill", selected ? "var(--primary-color)" : rect.dataset.baseColor ?? "#d0e8ff");
      if (text)
        text.setAttribute("fill", selected ? "white" : "#333");
    });
    this.setSelectionState(`${this.getSelectedPrefName()}を選択中`, "企業データと地図を準備しています。少しお待ちください。");
    this.setResultsHeader(`${this.getSelectedPrefName()}の認定企業`, "gBizINFO の公開データを読み込み中です。", LOADING_MSG);
    this.mapCtrl.showMap(code);
    this.fetchData(code);
  }
  bindEvents() {
    this.selector.addEventListener("change", () => {
      const code = this.selector.value;
      if (!code)
        return;
      this.mapCtrl.showMap(code);
      this.fetchData(code);
    });
    this.filterInput.addEventListener("input", () => {
      this.applyFilter();
    });
    this.certFilter.addEventListener("change", () => {
      this.applyFilter();
    });
    this.viewToggleCard.addEventListener("click", () => {
      this.setViewMode("card");
    });
    this.viewToggleCompact.addEventListener("click", () => {
      this.setViewMode("compact");
    });
  }
  setViewMode(mode) {
    this.viewMode = mode;
    this.viewToggleCard.classList.toggle("active", mode === "card");
    this.viewToggleCard.setAttribute("aria-pressed", String(mode === "card"));
    this.viewToggleCompact.classList.toggle("active", mode === "compact");
    this.viewToggleCompact.setAttribute("aria-pressed", String(mode === "compact"));
    this.applyFilter();
  }
  renderInitialState() {
    this.setSelectionState("都道府県を選択してください", "地方地図または一覧から選ぶと、認定企業の一覧と地図を同時に確認できます。");
    this.setResultsHeader("認定企業を探す", "都道府県を選択すると、認定企業の一覧と地図をまとめて確認できます。", "全国47都道府県");
  }
  getSelectedPrefName() {
    return PREF_MAP[this.selectedCode] ?? PREF_MAP[this.selector.value] ?? "選択中の地域";
  }
  setSelectionState(title, summary) {
    this.selectionTitle.textContent = title;
    this.selectionSummary.textContent = summary;
  }
  setResultsHeader(title, meta, count) {
    this.resultsTitle.textContent = title;
    this.resultsMeta.textContent = meta;
    this.resultsCount.textContent = count;
  }
  renderState(kind, title, body) {
    this.container.innerHTML = `
      <section class="state-panel state-panel--${kind}">
        <p class="state-panel__eyebrow">${kind === "loading" ? "Loading" : kind === "error" ? "Notice" : "Guide"}</p>
        <h3 class="state-panel__title">${escapeHtml3(title)}</h3>
        <p class="state-panel__body">${escapeHtml3(body)}</p>
      </section>
    `;
  }
  async fetchData(code) {
    this.renderState("loading", `${this.getSelectedPrefName()}を読み込み中`, "gBizINFO の認定企業データを取得しています。");
    this.filterWrap.hidden = true;
    this.filterInput.value = "";
    this.certFilter.innerHTML = `<option value="">すべて</option>`;
    this.mapCtrl.clearMarkers();
    try {
      const res = await fetch(`./data/${code}.json`);
      if (!res.ok)
        throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      this.render(data["hojin-infos"]);
    } catch (e) {
      console.error(e);
      this.setSelectionState(`${this.getSelectedPrefName()}のデータを取得できませんでした`, ERR_NO_DATA);
      this.setResultsHeader(`${this.getSelectedPrefName()}のデータを表示できません`, "時間をおいて再試行するか、別の都道府県を選択してください。", "取得失敗");
      this.renderState("error", "データの取得に失敗しました", ERR_NO_DATA);
    }
  }
  render(companies) {
    this.allCompanies = companies;
    this.filterWrap.hidden = companies.length === 0;
    if (companies.length === 0) {
      this.setSelectionState(`${this.getSelectedPrefName()}で公開中の企業は見つかりませんでした`, "この都道府県では、現在表示できる認定企業データがありません。別の都道府県も試せます。");
      this.setResultsHeader(`${this.getSelectedPrefName()}の認定企業`, "公開データ内で該当企業が見つかりませんでした。", "0件");
      this.renderState("empty", "現在表示できる企業データがありません", "別の都道府県を選ぶと、一覧と地図を引き続き比較できます。");
      this.mapCtrl.updateMarkers([]);
      return;
    }
    this.populateCertOptions(companies);
    this.setSelectionState(`${this.getSelectedPrefName()}を表示中`, `認定企業 ${companies.length} 件を読み込みました。企業名や認定名称でさらに絞り込めます。`);
    this.applyFilter();
  }
  applyFilter() {
    const nameQuery = this.filterInput.value.trim().toLowerCase();
    const certQuery = this.certFilter.value;
    const filtered = this.allCompanies.filter((c) => {
      if (nameQuery && !c.name.toLowerCase().includes(nameQuery))
        return false;
      if (certQuery && !c.certification.some((cert) => cert.certification_name === certQuery))
        return false;
      return true;
    });
    if (filtered.length === 0) {
      const activeFilters = [
        nameQuery ? `企業名「${escapeHtml3(this.filterInput.value.trim())}」` : "",
        certQuery ? `認定「${escapeHtml3(certQuery)}」` : ""
      ].filter(Boolean);
      this.setResultsHeader(`${this.getSelectedPrefName()}の認定企業`, activeFilters.length > 0 ? `${activeFilters.join(" / ")} に一致する企業が見つかりませんでした。` : ERR_NO_COMPANIES, "0件");
      this.renderState("empty", "条件に合う企業がありません", activeFilters.length > 0 ? `${activeFilters.join(" / ")} の条件を広げて再検索してください。` : ERR_NO_COMPANIES);
      this.mapCtrl.updateMarkers([]);
      return;
    }
    const filterSummary = [
      nameQuery ? `企業名「${escapeHtml3(this.filterInput.value.trim())}」` : "",
      certQuery ? `認定「${escapeHtml3(certQuery)}」` : ""
    ].filter(Boolean);
    const builder = this.viewMode === "compact" ? buildCompanyCardCompactHtml : buildCompanyCardHtml;
    this.container.innerHTML = filtered.map(builder).join("");
    this.mapCtrl.updateMarkers(filtered);
    this.setResultsHeader(`${this.getSelectedPrefName()}の認定企業`, filterSummary.length > 0 ? `${filterSummary.join(" / ")} で絞り込んだ結果です。` : "地図上の分布とカード一覧を見比べながら、地域の認定企業を比較できます。", `${filtered.length}件`);
  }
  populateCertOptions(companies) {
    const grouped = new Map;
    for (const company of companies) {
      for (const cert of company.certification) {
        const genre = normalizeCertificationGenreLabel(cert.genre);
        const names = grouped.get(genre) ?? new Set;
        names.add(cert.certification_name);
        grouped.set(genre, names);
      }
    }
    const remainingGenres = [...grouped.keys()].filter((genre) => !CERTIFICATION_GENRE_ORDER.includes(genre)).sort();
    const genreOrder = [...CERTIFICATION_GENRE_ORDER, ...remainingGenres];
    for (const genre of genreOrder) {
      const names = grouped.get(genre);
      if (!names || names.size === 0)
        continue;
      const optgroup = document.createElement("optgroup");
      optgroup.label = genre;
      for (const name of [...names].sort()) {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        optgroup.appendChild(opt);
      }
      this.certFilter.appendChild(optgroup);
    }
  }
}
window.addEventListener("DOMContentLoaded", () => new LocalStarsApp);
