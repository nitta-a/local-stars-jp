// src/web/app.ts
var PREF_MAP = {
  "05": "秋田県"
};

class LocalStarsApp {
  selector;
  container;
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
  bindEvents() {
    this.selector.addEventListener("change", () => {
      const code = this.selector.value;
      if (code)
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
        <p class="address">\uD83D\uDCCD ${c.address}</p>
        <div class="certification-tags">
          ${c.certification.map((cert) => `<span class="tag">${cert.certification_name}</span>`).join("")}
        </div>
      </div>
    `).join("");
  }
}
window.addEventListener("DOMContentLoaded", () => new LocalStarsApp);
