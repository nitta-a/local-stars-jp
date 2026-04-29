import type { Enterprise, GbizApiResponse } from "../types/gbiz";
import { PREF_MAP, REGION_GROUPS } from "./constants";
import { MapController } from "./map";
import { buildCompanyCardHtml, buildPrefSvg } from "./renderer";

const LOADING_MSG = "読み込み中...";
const ERR_NO_DATA = "データの取得に失敗しました。まだデータが準備されていない可能性があります。";
const ERR_NO_COMPANIES = "該当する企業はありません。";

class LocalStarsApp {
  private selector: HTMLSelectElement;
  private container: HTMLDivElement;
  private filterInput: HTMLInputElement;
  private certFilter: HTMLSelectElement;
  private filterWrap: HTMLElement;
  private mapCtrl = new MapController();
  private allCompanies: Enterprise[] = [];

  constructor() {
    this.selector = document.getElementById("pref-selector") as HTMLSelectElement;
    this.container = document.getElementById("list-container") as HTMLDivElement;
    this.filterInput = document.getElementById("name-filter") as HTMLInputElement;
    this.certFilter = document.getElementById("cert-filter") as HTMLSelectElement;
    this.filterWrap = document.getElementById("name-filter-wrap") as HTMLElement;

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

  private initVisualMap() {
    document.querySelectorAll<SVGGElement>(".region-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        this.showPrefGrid(idx);
      });
    });
    document.getElementById("back-to-regions")?.addEventListener("click", () => {
      (document.getElementById("pref-grid-view") as HTMLElement).hidden = true;
      (document.getElementById("region-view") as HTMLElement).hidden = false;
    });
  }

  private showPrefGrid(regionIdx: number) {
    const region = REGION_GROUPS[regionIdx];
    // 都道府県が1つだけの地方（北海道など）は地方内選択を省略して直接選択
    if (region.codes.length === 1) {
      this.selectPrefecture(region.codes[0]);
      return;
    }

    (document.getElementById("region-view") as HTMLElement).hidden = true;
    const prefGridView = document.getElementById("pref-grid-view") as HTMLElement;
    prefGridView.hidden = false;
    (document.getElementById("selected-region-name") as HTMLElement).textContent = region.label;

    const svgEl = buildPrefSvg(regionIdx, this.selector.value, (code) => this.selectPrefecture(code));
    const grid = document.getElementById("pref-grid") as HTMLElement;
    grid.innerHTML = "";
    grid.appendChild(svgEl);
  }

  private selectPrefecture(code: string) {
    this.selector.value = code;
    document.querySelectorAll<SVGGElement>(".pref-cell").forEach((g) => {
      const selected = g.dataset.code === code;
      g.classList.toggle("selected", selected);
      g.setAttribute("aria-pressed", String(selected));
      const rect = g.querySelector("rect");
      const text = g.querySelector("text");
      if (rect) rect.setAttribute("fill", selected ? "var(--primary-color)" : (rect.dataset.baseColor ?? "#d0e8ff"));
      if (text) text.setAttribute("fill", selected ? "white" : "#333");
    });
    this.mapCtrl.showMap(code);
    this.fetchData(code);
  }

  private bindEvents() {
    this.selector.addEventListener("change", () => {
      const code = this.selector.value;
      if (!code) return;
      this.mapCtrl.showMap(code);
      this.fetchData(code);
    });
    this.filterInput.addEventListener("input", () => {
      this.applyFilter();
    });
    this.certFilter.addEventListener("change", () => {
      this.applyFilter();
    });
  }

  private async fetchData(code: string) {
    this.container.innerHTML = `<p class="loading">${LOADING_MSG}</p>`;
    this.filterWrap.hidden = true;
    this.filterInput.value = "";
    this.certFilter.innerHTML = `<option value="">すべて</option>`;
    this.mapCtrl.clearMarkers();
    try {
      const res = await fetch(`./data/${code}.json`);
      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = (await res.json()) as GbizApiResponse;
      this.render(data["hojin-infos"]);
    } catch (e) {
      console.error(e);
      this.container.innerHTML = `<p class="error">${ERR_NO_DATA}</p>`;
    }
  }

  private render(companies: Enterprise[]) {
    this.allCompanies = companies;
    this.filterWrap.hidden = companies.length === 0;
    // 認定名称の選択肢を一意に収集
    const certNames = [
      ...new Set(companies.flatMap((c) => c.certification.map((cert) => cert.certification_name))),
    ].sort();
    for (const name of certNames) {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      this.certFilter.appendChild(opt);
    }
    this.applyFilter();
  }

  private applyFilter() {
    const nameQuery = this.filterInput.value.trim().toLowerCase();
    const certQuery = this.certFilter.value;
    const filtered = this.allCompanies.filter((c) => {
      if (nameQuery && !c.name.toLowerCase().includes(nameQuery)) return false;
      if (certQuery && !c.certification.some((cert) => cert.certification_name === certQuery)) return false;
      return true;
    });
    if (filtered.length === 0) {
      this.container.innerHTML = `<p class="error">${ERR_NO_COMPANIES}</p>`;
      this.mapCtrl.updateMarkers([]);
      return;
    }
    this.container.innerHTML = filtered.map(buildCompanyCardHtml).join("");
    this.mapCtrl.updateMarkers(filtered);
  }
}

window.addEventListener("DOMContentLoaded", () => new LocalStarsApp());
