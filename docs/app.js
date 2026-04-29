// src/web/app.ts
var PREF_MAP = {
  "02": "青森県",
  "03": "岩手県",
  "04": "宮城県",
  "05": "秋田県",
  "06": "山形県",
  "07": "福島県"
};
var PREF_COORDS = {
  "02": [40.8243, 140.74],
  "03": [39.7036, 141.1525],
  "04": [38.2682, 140.8694],
  "05": [39.7186, 140.1024],
  "06": [38.2554, 140.3396],
  "07": [37.7503, 140.4675]
};

class LocalStarsApp {
  selector;
  container;
  map = null;
  constructor() {
    this.selector = document.getElementById("pref-selector");
    this.container = document.getElementById("list-container");
    this.initSelector();
    this.bindEvents();
  }
  initSelector() {
    Object.entries(PREF_MAP).forEach(([code, name]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = name;
      this.selector.appendChild(option);
    });
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
  }
}
window.addEventListener("DOMContentLoaded", () => new LocalStarsApp);
