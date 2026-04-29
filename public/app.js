// src/web/app.ts
var PREF_MAP = {
  "05": "秋田県",
  "13": "東京都"
};

class App {
  selector;
  container;
  constructor() {
    this.selector = document.getElementById("pref-selector");
    this.container = document.getElementById("list-container");
    this.init();
  }
  init() {
    this.renderSelector();
    this.selector.addEventListener("change", () => {
      const code = this.selector.value;
      if (code) {
        this.loadData(code);
      }
    });
  }
  renderSelector() {
    Object.entries(PREF_MAP).forEach(([code, name]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = name;
      this.selector.appendChild(option);
    });
  }
  async loadData(prefCode) {
    this.container.innerHTML = '<p class="loading">データを読み込み中...</p>';
    try {
      const response = await fetch(`../data/${prefCode}.json`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      this.renderList(data["hojin-infos"]);
    } catch (error) {
      console.error("Fetch error:", error);
      this.container.innerHTML = '<p class="error">データの取得に失敗しました。まだデータが生成されていない可能性があります。</p>';
    }
  }
  renderList(companies) {
    if (companies.length === 0) {
      this.container.innerHTML = "<p>該当する企業は見つかりませんでした。</p>";
      return;
    }
    this.container.innerHTML = companies.map((c) => `
      <div class="company-card">
        <div class="company-header">
          <span class="corporate-number">法人番号: ${c.corporate_number}</span>
          <h3 class="company-name">${c.name}</h3>
        </div>
        <p class="address">\uD83D\uDCCD ${c.address}</p>
        <div class="certification-tags">
          ${c.certification.map((cert) => `
            <span class="tag">${cert.certification_name}</span>
          `).join("")}
        </div>
        <div class="links">
          <a href="https://info.gbiz.go.jp/hojin/ichiran?hojinBango=${c.corporate_number}" target="_blank" rel="noopener">
            gBizINFOで詳細を見る ↗
          </a>
        </div>
      </div>
    `).join("");
  }
}
window.addEventListener("DOMContentLoaded", () => new App);
