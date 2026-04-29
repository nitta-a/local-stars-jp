import type { Enterprise, GbizApiResponse } from "../types/gbiz";

// 1. 都道府県のマスターデータを定義
const PREF_MAP: Record<string, string> = {
  "05": "秋田県",
  // 他の都道府県を追加する場合はここに追記
  // "13": "東京都",
};

class LocalStarsApp {
  private selector: HTMLSelectElement;
  private container: HTMLDivElement;

  constructor() {
    this.selector = document.getElementById("pref-selector") as HTMLSelectElement;
    this.container = document.getElementById("list-container") as HTMLDivElement;

    // 2. 選択肢を生成する処理を呼び出す
    this.initSelector();
    this.bindEvents();
  }

  // ここが欠落していました！
  private initSelector() {
    Object.entries(PREF_MAP).forEach(([code, name]) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = name;
      this.selector.appendChild(option);
    });
  }

  private bindEvents() {
    this.selector.addEventListener("change", () => {
      const code = this.selector.value;
      if (code) this.fetchData(code);
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
    if (companies.length === 0) {
      this.container.innerHTML = "<p>該当する企業はありません。</p>";
      return;
    }

    this.container.innerHTML = companies
      .map(
        (c) => `
      <div class="company-card">
        <h3 class="company-name">${c.name}</h3>
        <p class="address">📍 ${c.address}</p>
        <div class="certification-tags">
          ${c.certification.map((cert) => `<span class="tag">${cert.certification_name}</span>`).join("")}
        </div>
      </div>
    `,
      )
      .join("");
  }
}

window.addEventListener("DOMContentLoaded", () => new LocalStarsApp());
