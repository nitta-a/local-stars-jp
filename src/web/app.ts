import type { Enterprise, GbizApiResponse } from "../types/gbiz";
import { PREF_MAP, REGION_GROUPS } from "./constants";
import { MapController } from "./map";
import { buildCompanyCardCompactHtml, buildCompanyCardHtml, buildPrefSvg } from "./renderer";

const LOADING_MSG = "読み込み中...";
const ERR_NO_DATA = "データの取得に失敗しました。まだデータが準備されていない可能性があります。";
const ERR_NO_COMPANIES = "該当する企業はありません。";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

class LocalStarsApp {
  private selector: HTMLSelectElement;
  private container: HTMLElement;
  private filterInput: HTMLInputElement;
  private certFilter: HTMLSelectElement;
  private filterWrap: HTMLElement;
  private viewToggleCard: HTMLButtonElement;
  private viewToggleCompact: HTMLButtonElement;
  private selectionTitle: HTMLElement;
  private selectionSummary: HTMLElement;
  private resultsTitle: HTMLElement;
  private resultsMeta: HTMLElement;
  private resultsCount: HTMLElement;
  private mapCtrl = new MapController();
  private allCompanies: Enterprise[] = [];
  private viewMode: "card" | "compact" = "card";
  private selectedCode = "";

  constructor() {
    this.selector = document.getElementById("pref-selector") as HTMLSelectElement;
    this.container = document.getElementById("list-container") as HTMLElement;
    this.filterInput = document.getElementById("name-filter") as HTMLInputElement;
    this.certFilter = document.getElementById("cert-filter") as HTMLSelectElement;
    this.filterWrap = document.getElementById("name-filter-wrap") as HTMLElement;
    this.viewToggleCard = document.getElementById("view-toggle-card") as HTMLButtonElement;
    this.viewToggleCompact = document.getElementById("view-toggle-compact") as HTMLButtonElement;
    this.selectionTitle = document.getElementById("selection-title") as HTMLElement;
    this.selectionSummary = document.getElementById("selection-summary") as HTMLElement;
    this.resultsTitle = document.getElementById("results-title") as HTMLElement;
    this.resultsMeta = document.getElementById("results-meta") as HTMLElement;
    this.resultsCount = document.getElementById("results-count") as HTMLElement;

    this.initSelector();
    this.initVisualMap();
    this.initTabs();
    this.bindEvents();
    this.renderInitialState();
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

  private initTabs() {
    const tabMap = document.getElementById("tab-btn-map") as HTMLButtonElement;
    const tabList = document.getElementById("tab-btn-list") as HTMLButtonElement;
    const panelMap = document.getElementById("tab-panel-map") as HTMLElement;
    const panelList = document.getElementById("tab-panel-list") as HTMLElement;

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
    this.selectedCode = code;
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
    this.setSelectionState(
      `${this.getSelectedPrefName()}を選択中`,
      "企業データと地図を準備しています。少しお待ちください。",
    );
    this.setResultsHeader(
      `${this.getSelectedPrefName()}の認定企業`,
      "gBizINFO の公開データを読み込み中です。",
      LOADING_MSG,
    );
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
    this.viewToggleCard.addEventListener("click", () => {
      this.setViewMode("card");
    });
    this.viewToggleCompact.addEventListener("click", () => {
      this.setViewMode("compact");
    });
  }

  private setViewMode(mode: "card" | "compact") {
    this.viewMode = mode;
    this.viewToggleCard.classList.toggle("active", mode === "card");
    this.viewToggleCard.setAttribute("aria-pressed", String(mode === "card"));
    this.viewToggleCompact.classList.toggle("active", mode === "compact");
    this.viewToggleCompact.setAttribute("aria-pressed", String(mode === "compact"));
    this.applyFilter();
  }

  private renderInitialState() {
    this.setSelectionState(
      "都道府県を選択してください",
      "地方地図または一覧から選ぶと、認定企業の一覧と地図を同時に確認できます。",
    );
    this.setResultsHeader(
      "認定企業を探す",
      "都道府県を選択すると、認定企業の一覧と地図をまとめて確認できます。",
      "全国47都道府県",
    );
  }

  private getSelectedPrefName(): string {
    return PREF_MAP[this.selectedCode] ?? PREF_MAP[this.selector.value] ?? "選択中の地域";
  }

  private setSelectionState(title: string, summary: string) {
    this.selectionTitle.textContent = title;
    this.selectionSummary.textContent = summary;
  }

  private setResultsHeader(title: string, meta: string, count: string) {
    this.resultsTitle.textContent = title;
    this.resultsMeta.textContent = meta;
    this.resultsCount.textContent = count;
  }

  private renderState(kind: "placeholder" | "loading" | "empty" | "error", title: string, body: string) {
    this.container.innerHTML = `
      <section class="state-panel state-panel--${kind}">
        <p class="state-panel__eyebrow">${kind === "loading" ? "Loading" : kind === "error" ? "Notice" : "Guide"}</p>
        <h3 class="state-panel__title">${escapeHtml(title)}</h3>
        <p class="state-panel__body">${escapeHtml(body)}</p>
      </section>
    `;
  }

  private async fetchData(code: string) {
    this.renderState(
      "loading",
      `${this.getSelectedPrefName()}を読み込み中`,
      "gBizINFO の認定企業データを取得しています。",
    );
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
      this.setSelectionState(`${this.getSelectedPrefName()}のデータを取得できませんでした`, ERR_NO_DATA);
      this.setResultsHeader(
        `${this.getSelectedPrefName()}のデータを表示できません`,
        "時間をおいて再試行するか、別の都道府県を選択してください。",
        "取得失敗",
      );
      this.renderState("error", "データの取得に失敗しました", ERR_NO_DATA);
    }
  }

  private render(companies: Enterprise[]) {
    this.allCompanies = companies;
    this.filterWrap.hidden = companies.length === 0;
    if (companies.length === 0) {
      this.setSelectionState(
        `${this.getSelectedPrefName()}で公開中の企業は見つかりませんでした`,
        "この都道府県では、現在表示できる認定企業データがありません。別の都道府県も試せます。",
      );
      this.setResultsHeader(
        `${this.getSelectedPrefName()}の認定企業`,
        "公開データ内で該当企業が見つかりませんでした。",
        "0件",
      );
      this.renderState(
        "empty",
        "現在表示できる企業データがありません",
        "別の都道府県を選ぶと、一覧と地図を引き続き比較できます。",
      );
      this.mapCtrl.updateMarkers([]);
      return;
    }

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
    this.setSelectionState(
      `${this.getSelectedPrefName()}を表示中`,
      `認定企業 ${companies.length} 件を読み込みました。企業名や認定名称でさらに絞り込めます。`,
    );
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
      const activeFilters = [
        nameQuery ? `企業名「${escapeHtml(this.filterInput.value.trim())}」` : "",
        certQuery ? `認定「${escapeHtml(certQuery)}」` : "",
      ].filter(Boolean);
      this.setResultsHeader(
        `${this.getSelectedPrefName()}の認定企業`,
        activeFilters.length > 0
          ? `${activeFilters.join(" / ")} に一致する企業が見つかりませんでした。`
          : ERR_NO_COMPANIES,
        "0件",
      );
      this.renderState(
        "empty",
        "条件に合う企業がありません",
        activeFilters.length > 0 ? `${activeFilters.join(" / ")} の条件を広げて再検索してください。` : ERR_NO_COMPANIES,
      );
      this.mapCtrl.updateMarkers([]);
      return;
    }

    const filterSummary = [
      nameQuery ? `企業名「${escapeHtml(this.filterInput.value.trim())}」` : "",
      certQuery ? `認定「${escapeHtml(certQuery)}」` : "",
    ].filter(Boolean);
    const builder = this.viewMode === "compact" ? buildCompanyCardCompactHtml : buildCompanyCardHtml;
    this.container.innerHTML = filtered.map(builder).join("");
    this.mapCtrl.updateMarkers(filtered);
    this.setResultsHeader(
      `${this.getSelectedPrefName()}の認定企業`,
      filterSummary.length > 0
        ? `${filterSummary.join(" / ")} で絞り込んだ結果です。`
        : "地図上の分布とカード一覧を見比べながら、地域の認定企業を比較できます。",
      `${filtered.length}件`,
    );
  }
}

window.addEventListener("DOMContentLoaded", () => new LocalStarsApp());
