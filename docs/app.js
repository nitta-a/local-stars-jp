// src/web/app.ts
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
  { label: "北海道地方", codes: ["01"] },
  { label: "東北地方", codes: ["02", "03", "04", "05", "06", "07"] },
  { label: "関東地方", codes: ["08", "09", "10", "11", "12", "13", "14"] },
  { label: "中部地方", codes: ["15", "16", "17", "18", "19", "20", "21", "22", "23"] },
  { label: "近畿地方", codes: ["24", "25", "26", "27", "28", "29", "30"] },
  { label: "中国地方", codes: ["31", "32", "33", "34", "35"] },
  { label: "四国地方", codes: ["36", "37", "38", "39"] },
  { label: "九州・沖縄地方", codes: ["40", "41", "42", "43", "44", "45", "46", "47"] }
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

class LocalStarsApp {
  selector;
  container;
  map = null;
  markers = [];
  constructor() {
    this.selector = document.getElementById("pref-selector");
    this.container = document.getElementById("list-container");
    this.initSelector();
    this.initVisualMap();
    this.bindEvents();
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
  showMap(code) {
    const coords = PREF_COORDS[code];
    if (!coords)
      return;
    const mapEl = document.getElementById("map");
    mapEl.hidden = false;
    if (this.map === null) {
      this.map = L.map("map").setView(coords, 10);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);
    } else {
      this.map.flyTo(coords, 10);
    }
  }
  clearMarkers() {
    for (const marker of this.markers)
      marker.remove();
    this.markers = [];
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
  showPrefGrid(regionIdx) {
    const region = REGION_GROUPS[regionIdx];
    const layout = REGION_GRID_LAYOUT[regionIdx];
    document.getElementById("region-view").hidden = true;
    const prefGridView = document.getElementById("pref-grid-view");
    prefGridView.hidden = false;
    const label = document.getElementById("selected-region-name");
    label.textContent = region.label;
    const grid = document.getElementById("pref-grid");
    grid.style.gridTemplateColumns = `repeat(${layout.cols}, 1fr)`;
    grid.innerHTML = "";
    for (const cell of layout.prefs) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "pref-btn";
      btn.dataset.code = cell.code;
      btn.style.gridColumn = String(cell.col);
      btn.style.gridRow = String(cell.row);
      btn.textContent = (PREF_MAP[cell.code] ?? cell.code).replace(/[都道府県]$/, "");
      if (cell.code === this.selector.value)
        btn.classList.add("selected");
      btn.addEventListener("click", () => this.selectPrefecture(cell.code));
      grid.appendChild(btn);
    }
  }
  selectPrefecture(code) {
    this.selector.value = code;
    document.querySelectorAll(".pref-btn").forEach((btn) => {
      btn.classList.toggle("selected", btn.dataset.code === code);
    });
    this.showMap(code);
    this.fetchData(code);
  }
  bindEvents() {
    this.selector.addEventListener("change", () => {
      const code = this.selector.value;
      if (!code)
        return;
      this.showMap(code);
      this.fetchData(code);
    });
  }
  async fetchData(code) {
    this.container.innerHTML = '<p class="loading">読み込み中...</p>';
    try {
      const res = await fetch(`./data/${code}.json`);
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }
      const data = await res.json();
      this.render(data["hojin-infos"]);
    } catch (e) {
      console.error(e);
      this.container.innerHTML = '<p class="error">データの取得に失敗しました。まだデータが準備されていない可能性があります。</p>';
    }
  }
  render(companies) {
    this.clearMarkers();
    if (companies.length === 0) {
      this.container.innerHTML = "<p>該当する企業はありません。</p>";
      return;
    }
    this.container.innerHTML = companies.map((c) => `
      <div class="company-card">
        <h3 class="company-name">${c.name}</h3>
        <p class="address">\uD83D\uDCCD <a href="https://maps.google.com/maps?q=${encodeURIComponent(c.address)}" target="_blank" rel="noopener noreferrer">${c.address}</a></p>
        <div class="certification-tags">
          ${c.certification.map((cert) => `<span class="tag">${cert.certification_name}</span>`).join("")}
        </div>
      </div>
    `).join("");
    if (this.map !== null) {
      for (const c of companies) {
        if (c.lat !== undefined && c.lng !== undefined) {
          const jitter = () => (Math.random() - 0.5) * 0.02;
          const marker = L.marker([c.lat + jitter(), c.lng + jitter()]).addTo(this.map).bindPopup(`<strong>${c.name}</strong><br><small>${c.address}</small>`);
          this.markers.push(marker);
        }
      }
    }
  }
}
window.addEventListener("DOMContentLoaded", () => new LocalStarsApp);
