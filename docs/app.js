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

// src/web/page-config.ts
function normalizeAssetBase(value) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return ".";
  }
  if (trimmed === "/") {
    return "/";
  }
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}
function getPageConfig() {
  const root = document.documentElement;
  const assetBase = normalizeAssetBase(root.dataset.assetBase);
  const fixedPrefCode = (root.dataset.prefCode ?? "").trim();
  return {
    assetBase,
    fixedPrefCode,
    isFixedPrefPage: fixedPrefCode.length > 0
  };
}
function resolveAssetPath(pathFromDocsRoot) {
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
function buildPrefecturePagePath(code) {
  const { isFixedPrefPage } = getPageConfig();
  return isFixedPrefPage ? `../${code}/` : `./pref/${code}/`;
}

// src/web/map.ts
var TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
var TILE_ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: resolveAssetPath("images/marker-icon.png"),
  iconRetinaUrl: resolveAssetPath("images/marker-icon-2x.png"),
  shadowUrl: resolveAssetPath("images/marker-shadow.png")
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
function buildExternalLinkIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M14 4h6v6h-2V7.41l-7.29 7.3-1.42-1.42 7.3-7.29H14V4Zm4 14H6V6h6V4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6h-2v6Z"
        fill="currentColor"
      />
    </svg>
  `;
}
function buildAwardDetailHtml(sourceName, award) {
  const title = award.name === sourceName ? sourceName : `${sourceName} / ${award.name}`;
  return `
    <div class="award-popover__panel">
      <p class="award-popover__category">${escapeHtml2(award.category)}</p>
      <h4 class="award-popover__title">${escapeHtml2(title)}</h4>
      <p class="award-popover__description">${escapeHtml2(award.description)}</p>
      <a class="award-popover__link" href="${escapeHtml2(award.official_url)}" target="_blank" rel="noopener noreferrer">
        <span>詳細を見る</span>
        <span class="award-popover__link-icon">${buildExternalLinkIcon()}</span>
      </a>
    </div>
  `;
}
function buildCertificationTagHtml(name, award) {
  const label = escapeHtml2(name);
  if (!award)
    return `<span class="tag">${label}</span>`;
  return `
    <details class="award-popover">
      <summary class="tag tag--interactive">${label}</summary>
      ${buildAwardDetailHtml(name, award)}
    </details>
  `;
}
function buildCertificationTags(c) {
  return c.certification.map((cert) => buildCertificationTagHtml(cert.certification_name, cert.award)).join("");
}
function formatWithUnit(value, unit) {
  if (!value)
    return null;
  return /[%年月日時分間人歳]$/.test(value) ? value : `${value}${unit}`;
}
function calculateRatio(numerator, denominator) {
  if (!numerator || !denominator)
    return null;
  const num = Number(numerator);
  const den = Number(denominator);
  if (!Number.isFinite(num) || !Number.isFinite(den) || den <= 0)
    return null;
  return `${(num / den * 100).toFixed(1)}%`;
}
function buildLaborSummaryItems(data) {
  const items = [
    {
      label: "女性比率",
      value: formatWithUnit(data.female_worker_ratio, "%")
    },
    {
      label: "女性管理職比率",
      value: calculateRatio(data.female_manager_count, data.manager_total_count)
    },
    {
      label: "平均勤続",
      value: formatWithUnit(data.average_continuous_service_years_regular, "年") ?? formatWithUnit(data.average_continuous_service_years_male, "年") ?? formatWithUnit(data.average_continuous_service_years_female, "年")
    },
    {
      label: "平均年齢",
      value: formatWithUnit(data.average_employee_age, "歳")
    },
    {
      label: "月平均残業",
      value: formatWithUnit(data.monthly_overtime_hours, "時間")
    }
  ];
  return items.filter((item) => Boolean(item.value)).slice(0, 4);
}
function buildLaborSummaryHtml(data, compact = false) {
  if (!data)
    return "";
  const items = buildLaborSummaryItems(data);
  if (items.length === 0)
    return "";
  return `
    <section class="labor-summary${compact ? " labor-summary--compact" : ""}" aria-label="職場情報の要約">
      ${items.map((item) => `
            <div class="labor-chip">
              <span class="labor-chip__label">${escapeHtml2(item.label)}</span>
              <strong class="labor-chip__value">${escapeHtml2(item.value)}</strong>
            </div>
          `).join("")}
    </section>
  `;
}
function buildLaborMetricRows(data) {
  const rows = [
    { label: "平均継続勤務年数の対象", value: data.average_continuous_service_years_scope ?? null },
    { label: "平均継続勤務年数（男性）", value: formatWithUnit(data.average_continuous_service_years_male, "年") },
    { label: "平均継続勤務年数（女性）", value: formatWithUnit(data.average_continuous_service_years_female, "年") },
    { label: "正社員の平均継続勤務年数", value: formatWithUnit(data.average_continuous_service_years_regular, "年") },
    { label: "従業員の平均年齢", value: formatWithUnit(data.average_employee_age, "歳") },
    { label: "月平均所定外労働時間", value: formatWithUnit(data.monthly_overtime_hours, "時間") },
    { label: "女性労働者比率の対象", value: data.female_worker_ratio_scope ?? null },
    { label: "女性労働者比率", value: formatWithUnit(data.female_worker_ratio, "%") },
    {
      label: "女性管理職",
      value: data.female_manager_count && data.manager_total_count ? `${data.female_manager_count}人 / ${data.manager_total_count}人 (${calculateRatio(data.female_manager_count, data.manager_total_count) ?? "-"})` : formatWithUnit(data.female_manager_count, "人")
    },
    {
      label: "女性役員",
      value: data.female_officer_count && data.officer_total_count ? `${data.female_officer_count}人 / ${data.officer_total_count}人 (${calculateRatio(data.female_officer_count, data.officer_total_count) ?? "-"})` : formatWithUnit(data.female_officer_count, "人")
    },
    { label: "育休対象者数（男性）", value: formatWithUnit(data.childcare_leave_eligible_male, "人") },
    { label: "育休対象者数（女性）", value: formatWithUnit(data.childcare_leave_eligible_female, "人") },
    { label: "育休取得者数（男性）", value: formatWithUnit(data.childcare_leave_taken_male, "人") },
    { label: "育休取得者数（女性）", value: formatWithUnit(data.childcare_leave_taken_female, "人") }
  ];
  return rows.filter((row) => Boolean(row.value));
}
function buildLaborDetailsHtml(data) {
  if (!data)
    return "";
  const rows = buildLaborMetricRows(data);
  if (rows.length === 0)
    return "";
  return `
    <details class="labor-details">
      <summary>職場情報の詳細を見る</summary>
      <dl class="labor-metrics">
        ${rows.map((row) => `
              <div class="labor-metrics__row">
                <dt>${escapeHtml2(row.label)}</dt>
                <dd>${escapeHtml2(row.value)}</dd>
              </div>
            `).join("")}
      </dl>
    </details>
  `;
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
        ${buildLaborSummaryHtml(c.labor_data)}
        <div class="certification-tags">
          ${buildCertificationTags(c)}
        </div>
        ${buildLaborDetailsHtml(c.labor_data)}
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
        <div class="company-card__compact-meta">
          <div class="certification-tags">
            ${buildCertificationTags(c)}
          </div>
          ${buildLaborSummaryHtml(c.labor_data, true)}
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

// src/web/share-panel.ts
class SharePanel extends HTMLElement {
  copyButton = null;
  statusElement = null;
  shareXLink = null;
  shareFacebookLink = null;
  shareLineLink = null;
  connectedCallback() {
    if (this.childElementCount === 0) {
      this.render();
    }
    this.classList.add("share-panel");
    this.copyButton = this.querySelector('[data-share="copy"]');
    this.statusElement = this.querySelector('[data-share="status"]');
    this.shareXLink = this.querySelector('[data-share="x"]');
    this.shareFacebookLink = this.querySelector('[data-share="facebook"]');
    this.shareLineLink = this.querySelector('[data-share="line"]');
    this.copyButton?.addEventListener("click", this.handleCopyClick);
  }
  disconnectedCallback() {
    this.copyButton?.removeEventListener("click", this.handleCopyClick);
  }
  updateShareLinks(url, text, status = "") {
    this.shareXLink?.setAttribute("href", `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    this.shareFacebookLink?.setAttribute("href", `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
    this.shareLineLink?.setAttribute("href", `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
    if (this.statusElement) {
      this.statusElement.textContent = status;
    }
  }
  handleCopyClick = async () => {
    const shareUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      this.updateShareLinks(shareUrl, this.getCurrentShareText(), "共有用リンクをコピーしました。");
    } catch (error) {
      console.error(error);
      this.updateShareLinks(shareUrl, this.getCurrentShareText(), "リンクをコピーできませんでした。ブラウザの共有メニューを利用してください。");
    }
  };
  getCurrentShareText() {
    return this.dataset.shareText ?? document.title;
  }
  render() {
    this.innerHTML = `
      <p class="share-panel__label">Share</p>
      <div class="share-panel__actions">
        <a class="share-link share-link--x share-link--icon-only" href="https://twitter.com/intent/tweet" target="_blank" rel="noopener noreferrer" aria-label="X で共有" data-share="x">
          <span class="share-link__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M18.244 2H21.5l-7.116 8.133L22.75 22h-6.554l-5.132-6.704L5.2 22H1.94l7.611-8.7L1.5 2h6.72l4.64 6.133L18.244 2Zm-1.142 18.05h1.804L7.28 3.852H5.344L17.102 20.05Z" fill="currentColor"/>
            </svg>
          </span>
          <span class="share-link__label">X</span>
        </a>
        <a class="share-link share-link--facebook" href="https://www.facebook.com/sharer/sharer.php" target="_blank" rel="noopener noreferrer" aria-label="Facebook で共有" data-share="facebook">
          <span class="share-link__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M13.647 22v-8.207h2.77l.415-3.2h-3.185V8.55c0-.927.257-1.56 1.588-1.56H16.96V4.126C16.124 4.037 15.283 3.993 14.442 4c-2.496 0-4.205 1.523-4.205 4.32v2.273H7.41v3.2h2.827V22h3.41Z" fill="currentColor"/>
            </svg>
          </span>
          <span class="share-link__label">Facebook</span>
        </a>
        <a class="share-link share-link--line" href="https://social-plugins.line.me/lineit/share" target="_blank" rel="noopener noreferrer" aria-label="LINE で共有" data-share="line">
          <span class="share-link__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M20.4 10.794c0-4.388-3.802-7.958-8.476-7.958S3.45 6.406 3.45 10.794c0 3.935 3.013 7.23 7.084 7.853.276.06.651.182.746.418.085.214.056.548.027.765l-.12.72c-.037.213-.17.835.73.455.9-.38 4.856-2.86 6.625-4.898 1.22-1.338 1.858-2.698 1.858-5.313Zm-11.3 2.166a.46.46 0 0 1-.46.46H6.065a.46.46 0 0 1-.46-.46V8.63a.46.46 0 1 1 .92 0v3.87H8.64a.46.46 0 0 1 .46.46Zm1.75 0a.46.46 0 0 1-.92 0V8.63a.46.46 0 1 1 .92 0v4.33Zm5.144 0a.46.46 0 0 1-.46.46.46.46 0 0 1-.355-.167l-2.238-2.84v2.547a.46.46 0 0 1-.92 0V8.63a.46.46 0 0 1 .46-.46c.138 0 .267.062.355.168l2.238 2.839V8.63a.46.46 0 1 1 .92 0v4.33Zm3.69-3.869h-2.115v1.028h2.115a.46.46 0 1 1 0 .92h-2.115v1.029h2.115a.46.46 0 1 1 0 .919h-2.575a.46.46 0 0 1-.46-.46V8.63a.46.46 0 0 1 .46-.46h2.575a.46.46 0 1 1 0 .92Z" fill="currentColor"/>
            </svg>
          </span>
          <span class="share-link__label">LINE</span>
        </a>
        <button class="share-link share-link--button share-link--copy" type="button" aria-label="共有リンクをコピー" data-share="copy">
          <span class="share-link__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1Zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H10V7h9v14Z" fill="currentColor"/>
            </svg>
          </span>
          <span class="share-link__label">リンクをコピー</span>
        </button>
      </div>
      <p class="share-panel__status" aria-live="polite" data-share="status"></p>
    `;
  }
}
if (!customElements.get("local-share-panel")) {
  customElements.define("local-share-panel", SharePanel);
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
  sharePanel;
  mapCtrl = new MapController;
  allCompanies = [];
  viewMode = "card";
  selectedCode = "";
  pendingUrlState;
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
    this.sharePanel = document.querySelector("local-share-panel");
    this.pendingUrlState = this.readUrlState();
    this.initSelector();
    this.initVisualMap();
    this.initTabs();
    this.bindEvents();
    this.renderInitialState();
    this.restoreInitialState();
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
      this.handlePrefectureSelection(region.codes[0]);
      return;
    }
    document.getElementById("region-view").hidden = true;
    const prefGridView = document.getElementById("pref-grid-view");
    prefGridView.hidden = false;
    document.getElementById("selected-region-name").textContent = region.label;
    const svgEl = buildPrefSvg(regionIdx, this.selector.value, (code) => this.handlePrefectureSelection(code));
    const grid = document.getElementById("pref-grid");
    grid.innerHTML = "";
    grid.appendChild(svgEl);
  }
  handlePrefectureSelection(code) {
    const { isFixedPrefPage } = getPageConfig();
    if (!isFixedPrefPage) {
      this.navigateToPrefecturePage(code);
      return;
    }
    this.selectPrefecture(code);
  }
  selectPrefecture(code) {
    const { fixedPrefCode, isFixedPrefPage } = getPageConfig();
    if (isFixedPrefPage && fixedPrefCode !== code) {
      this.navigateToPrefecturePage(code);
      return;
    }
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
      this.handlePrefectureSelection(code);
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
  setViewMode(mode, rerender = true) {
    this.viewMode = mode;
    this.viewToggleCard.classList.toggle("active", mode === "card");
    this.viewToggleCard.setAttribute("aria-pressed", String(mode === "card"));
    this.viewToggleCompact.classList.toggle("active", mode === "compact");
    this.viewToggleCompact.setAttribute("aria-pressed", String(mode === "compact"));
    if (rerender) {
      this.applyFilter();
    } else {
      this.syncUrlState();
      this.updateShareLinks();
    }
  }
  renderInitialState() {
    this.setSelectionState("都道府県を選択してください", "地方地図または一覧から選ぶと、認定企業の一覧と地図を同時に確認できます。");
    this.setResultsHeader("認定企業を探す", "都道府県を選択すると、認定企業の一覧と地図をまとめて確認できます。", "全国47都道府県");
    this.updateShareLinks();
  }
  readUrlState() {
    const params = new URLSearchParams(window.location.search);
    const { fixedPrefCode, isFixedPrefPage } = getPageConfig();
    const prefCode = isFixedPrefPage ? fixedPrefCode : params.get("pref") ?? "";
    const nameQuery = params.get("name") ?? "";
    const certQuery = params.get("cert") ?? "";
    const viewMode = params.get("view") === "compact" ? "compact" : "card";
    return { prefCode, nameQuery, certQuery, viewMode };
  }
  restoreInitialState() {
    const state = this.pendingUrlState;
    this.setViewMode(state?.viewMode ?? "card", false);
    if (!state || !state.prefCode || !(state.prefCode in PREF_MAP)) {
      this.pendingUrlState = null;
      this.syncUrlState();
      this.updateShareLinks();
      return;
    }
    this.filterInput.value = state.nameQuery;
    this.selectPrefecture(state.prefCode);
  }
  getSelectedPrefName() {
    return PREF_MAP[this.selectedCode] ?? PREF_MAP[this.selector.value] ?? "選択中の地域";
  }
  getActiveFilters() {
    return {
      nameQuery: this.filterInput.value.trim(),
      certQuery: this.certFilter.value
    };
  }
  getFilterSummaryParts() {
    const { nameQuery, certQuery } = this.getActiveFilters();
    return [nameQuery ? `企業名「${nameQuery}」` : "", certQuery ? `認定「${certQuery}」` : ""].filter(Boolean);
  }
  syncUrlState() {
    const url = new URL(window.location.href);
    const { nameQuery, certQuery } = this.getActiveFilters();
    const { isFixedPrefPage } = getPageConfig();
    if (!isFixedPrefPage && this.selectedCode) {
      url.searchParams.set("pref", this.selectedCode);
    } else {
      url.searchParams.delete("pref");
    }
    if (nameQuery) {
      url.searchParams.set("name", nameQuery);
    } else {
      url.searchParams.delete("name");
    }
    if (certQuery) {
      url.searchParams.set("cert", certQuery);
    } else {
      url.searchParams.delete("cert");
    }
    if (this.viewMode === "compact") {
      url.searchParams.set("view", "compact");
    } else {
      url.searchParams.delete("view");
    }
    history.replaceState(null, "", url);
  }
  navigateToPrefecturePage(code) {
    const url = new URL(buildPrefecturePagePath(code), window.location.href);
    const { nameQuery, certQuery } = this.getActiveFilters();
    if (nameQuery) {
      url.searchParams.set("name", nameQuery);
    }
    if (certQuery) {
      url.searchParams.set("cert", certQuery);
    }
    if (this.viewMode === "compact") {
      url.searchParams.set("view", "compact");
    }
    window.location.href = url.toString();
  }
  getShareText() {
    const filterSummary = this.getFilterSummaryParts().join(" / ");
    if (!this.selectedCode) {
      return "ユースエール、えるぼし、くるみん、健康経営優良法人などの認定企業を地図と一覧で探せる Local Stars JP";
    }
    if (filterSummary) {
      return `${this.getSelectedPrefName()}の認定企業を ${filterSummary} で絞り込んで確認できます。Local Stars JP`;
    }
    return `${this.getSelectedPrefName()}の優良認定企業を地図と一覧で探せます。Local Stars JP`;
  }
  updateShareLinks(status = "") {
    const shareUrl = window.location.href;
    const shareText = this.getShareText();
    if (this.sharePanel) {
      this.sharePanel.dataset.shareText = shareText;
      this.sharePanel.updateShareLinks(shareUrl, shareText, status);
    }
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
    this.syncUrlState();
    this.updateShareLinks();
    try {
      const res = await fetch(resolveAssetPath(`data/${code}.json`));
      if (!res.ok)
        throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      this.render(data["hojin-infos"]);
    } catch (e) {
      console.error(e);
      this.setSelectionState(`${this.getSelectedPrefName()}のデータを取得できませんでした`, ERR_NO_DATA);
      this.setResultsHeader(`${this.getSelectedPrefName()}のデータを表示できません`, "時間をおいて再試行するか、別の都道府県を選択してください。", "取得失敗");
      this.syncUrlState();
      this.updateShareLinks();
      this.renderState("error", "データの取得に失敗しました", ERR_NO_DATA);
    }
  }
  render(companies) {
    this.allCompanies = companies;
    this.filterWrap.hidden = companies.length === 0;
    if (this.pendingUrlState?.prefCode === this.selectedCode) {
      this.filterInput.value = this.pendingUrlState.nameQuery;
    }
    if (companies.length === 0) {
      this.setSelectionState(`${this.getSelectedPrefName()}で公開中の企業は見つかりませんでした`, "この都道府県では、現在表示できる認定企業データがありません。別の都道府県も試せます。");
      this.setResultsHeader(`${this.getSelectedPrefName()}の認定企業`, "公開データ内で該当企業が見つかりませんでした。", "0件");
      this.renderState("empty", "現在表示できる企業データがありません", "別の都道府県を選ぶと、一覧と地図を引き続き比較できます。");
      this.mapCtrl.updateMarkers([]);
      this.syncUrlState();
      this.updateShareLinks();
      return;
    }
    this.populateCertOptions(companies);
    if (this.pendingUrlState?.prefCode === this.selectedCode) {
      const hasCertOption = [...this.certFilter.options].some((option) => option.value === this.pendingUrlState?.certQuery);
      this.certFilter.value = hasCertOption ? this.pendingUrlState.certQuery : "";
      this.pendingUrlState = null;
    }
    this.setSelectionState(`${this.getSelectedPrefName()}を表示中`, `認定企業 ${companies.length} 件を読み込みました。企業名や認定名称でさらに絞り込めます。`);
    this.applyFilter();
  }
  applyFilter() {
    const { nameQuery: rawNameQuery, certQuery } = this.getActiveFilters();
    const nameQuery = rawNameQuery.toLowerCase();
    const filtered = this.allCompanies.filter((c) => {
      if (nameQuery && !c.name.toLowerCase().includes(nameQuery))
        return false;
      if (certQuery && !c.certification.some((cert) => cert.certification_name === certQuery))
        return false;
      return true;
    });
    if (filtered.length === 0) {
      const activeFilters = this.getFilterSummaryParts();
      this.setResultsHeader(`${this.getSelectedPrefName()}の認定企業`, activeFilters.length > 0 ? `${activeFilters.join(" / ")} に一致する企業が見つかりませんでした。` : ERR_NO_COMPANIES, "0件");
      this.renderState("empty", "条件に合う企業がありません", activeFilters.length > 0 ? `${activeFilters.join(" / ")} の条件を広げて再検索してください。` : ERR_NO_COMPANIES);
      this.mapCtrl.updateMarkers([]);
      this.syncUrlState();
      this.updateShareLinks();
      return;
    }
    const filterSummary = this.getFilterSummaryParts();
    const builder = this.viewMode === "compact" ? buildCompanyCardCompactHtml : buildCompanyCardHtml;
    this.container.innerHTML = filtered.map(builder).join("");
    this.mapCtrl.updateMarkers(filtered);
    this.setResultsHeader(`${this.getSelectedPrefName()}の認定企業`, filterSummary.length > 0 ? `${filterSummary.join(" / ")} で絞り込んだ結果です。` : "地図上の分布とカード一覧を見比べながら、地域の認定企業を比較できます。", `${filtered.length}件`);
    this.syncUrlState();
    this.updateShareLinks();
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
