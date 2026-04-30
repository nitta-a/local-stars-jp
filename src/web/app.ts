import { CERTIFICATION_GENRE_ORDER, normalizeCertificationGenreLabel } from "../certification.ts";
import type { Enterprise, GbizApiResponse } from "../types/gbiz";
import { PREF_MAP, REGION_GROUPS } from "./constants";
import { MapController } from "./map";
import { buildPrefecturePagePath, getPageConfig, resolveAssetPath } from "./page-config";
import { buildCompanyCardCompactHtml, buildCompanyCardHtml, buildPrefSvg } from "./renderer";

const LOADING_MSG = "読み込み中...";
const ERR_NO_DATA = "データの取得に失敗しました。まだデータが準備されていない可能性があります。";
const ERR_NO_COMPANIES = "該当する企業はありません。";

type ViewMode = "card" | "compact";

type UrlState = {
  prefCode: string;
  nameQuery: string;
  certQuery: string;
  viewMode: ViewMode;
};

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
  private shareX: HTMLAnchorElement;
  private shareFacebook: HTMLAnchorElement;
  private shareLine: HTMLAnchorElement;
  private shareCopy: HTMLButtonElement;
  private shareStatus: HTMLElement;
  private mapCtrl = new MapController();
  private allCompanies: Enterprise[] = [];
  private viewMode: ViewMode = "card";
  private selectedCode = "";
  private pendingUrlState: UrlState | null;

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
    this.shareX = document.getElementById("share-x") as HTMLAnchorElement;
    this.shareFacebook = document.getElementById("share-facebook") as HTMLAnchorElement;
    this.shareLine = document.getElementById("share-line") as HTMLAnchorElement;
    this.shareCopy = document.getElementById("share-copy") as HTMLButtonElement;
    this.shareStatus = document.getElementById("share-status") as HTMLElement;
    this.pendingUrlState = this.readUrlState();

    this.initSelector();
    this.initVisualMap();
    this.initTabs();
    this.bindEvents();
    this.renderInitialState();
    this.restoreInitialState();
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
    const { fixedPrefCode, isFixedPrefPage } = getPageConfig();

    if (isFixedPrefPage && fixedPrefCode !== code) {
      this.navigateToPrefecturePage(code);
      return;
    }

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
      this.selectPrefecture(code);
    });
    this.filterInput.addEventListener("input", () => {
      this.applyFilter();
    });
    this.certFilter.addEventListener("change", () => {
      this.applyFilter();
    });
    this.shareCopy.addEventListener("click", () => {
      void this.copyShareLink();
    });
    this.viewToggleCard.addEventListener("click", () => {
      this.setViewMode("card");
    });
    this.viewToggleCompact.addEventListener("click", () => {
      this.setViewMode("compact");
    });
  }

  private setViewMode(mode: ViewMode, rerender = true) {
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
    this.updateShareLinks();
  }

  private readUrlState(): UrlState {
    const params = new URLSearchParams(window.location.search);
    const { fixedPrefCode, isFixedPrefPage } = getPageConfig();
    const prefCode = isFixedPrefPage ? fixedPrefCode : (params.get("pref") ?? "");
    const nameQuery = params.get("name") ?? "";
    const certQuery = params.get("cert") ?? "";
    const viewMode = params.get("view") === "compact" ? "compact" : "card";

    return { prefCode, nameQuery, certQuery, viewMode };
  }

  private restoreInitialState() {
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

  private getSelectedPrefName(): string {
    return PREF_MAP[this.selectedCode] ?? PREF_MAP[this.selector.value] ?? "選択中の地域";
  }

  private getActiveFilters() {
    return {
      nameQuery: this.filterInput.value.trim(),
      certQuery: this.certFilter.value,
    };
  }

  private getFilterSummaryParts(): string[] {
    const { nameQuery, certQuery } = this.getActiveFilters();
    return [nameQuery ? `企業名「${nameQuery}」` : "", certQuery ? `認定「${certQuery}」` : ""].filter(Boolean);
  }

  private syncUrlState() {
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

  private navigateToPrefecturePage(code: string) {
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

  private getShareText(): string {
    const filterSummary = this.getFilterSummaryParts().join(" / ");

    if (!this.selectedCode) {
      return "ユースエール、えるぼし、くるみん、健康経営優良法人などの認定企業を地図と一覧で探せる Local Stars JP";
    }

    if (filterSummary) {
      return `${this.getSelectedPrefName()}の認定企業を ${filterSummary} で絞り込んで確認できます。Local Stars JP`;
    }

    return `${this.getSelectedPrefName()}の優良認定企業を地図と一覧で探せます。Local Stars JP`;
  }

  private updateShareLinks(status = "") {
    const shareUrl = window.location.href;
    const shareText = this.getShareText();

    this.shareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    this.shareFacebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    this.shareLine.href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    this.shareStatus.textContent = status;
  }

  private async copyShareLink() {
    const shareUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(shareUrl);
      this.updateShareLinks("共有用リンクをコピーしました。");
    } catch (error) {
      console.error(error);
      this.updateShareLinks("リンクをコピーできませんでした。ブラウザの共有メニューを利用してください。");
    }
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
    this.syncUrlState();
    this.updateShareLinks();
    try {
      const res = await fetch(resolveAssetPath(`data/${code}.json`));
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
      this.syncUrlState();
      this.updateShareLinks();
      this.renderState("error", "データの取得に失敗しました", ERR_NO_DATA);
    }
  }

  private render(companies: Enterprise[]) {
    this.allCompanies = companies;
    this.filterWrap.hidden = companies.length === 0;

    if (this.pendingUrlState?.prefCode === this.selectedCode) {
      this.filterInput.value = this.pendingUrlState.nameQuery;
    }

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
      this.syncUrlState();
      this.updateShareLinks();
      return;
    }

    this.populateCertOptions(companies);
    if (this.pendingUrlState?.prefCode === this.selectedCode) {
      const hasCertOption = [...this.certFilter.options].some(
        (option) => option.value === this.pendingUrlState?.certQuery,
      );
      this.certFilter.value = hasCertOption ? this.pendingUrlState.certQuery : "";
      this.pendingUrlState = null;
    }
    this.setSelectionState(
      `${this.getSelectedPrefName()}を表示中`,
      `認定企業 ${companies.length} 件を読み込みました。企業名や認定名称でさらに絞り込めます。`,
    );
    this.applyFilter();
  }

  private applyFilter() {
    const { nameQuery: rawNameQuery, certQuery } = this.getActiveFilters();
    const nameQuery = rawNameQuery.toLowerCase();
    const filtered = this.allCompanies.filter((c) => {
      if (nameQuery && !c.name.toLowerCase().includes(nameQuery)) return false;
      if (certQuery && !c.certification.some((cert) => cert.certification_name === certQuery)) return false;
      return true;
    });
    if (filtered.length === 0) {
      const activeFilters = this.getFilterSummaryParts();
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
      this.syncUrlState();
      this.updateShareLinks();
      return;
    }

    const filterSummary = this.getFilterSummaryParts();
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
    this.syncUrlState();
    this.updateShareLinks();
  }

  private populateCertOptions(companies: Enterprise[]) {
    const grouped = new Map<string, Set<string>>();

    for (const company of companies) {
      for (const cert of company.certification) {
        const genre = normalizeCertificationGenreLabel(cert.genre);
        const names = grouped.get(genre) ?? new Set<string>();
        names.add(cert.certification_name);
        grouped.set(genre, names);
      }
    }

    const remainingGenres = [...grouped.keys()]
      .filter((genre) => !CERTIFICATION_GENRE_ORDER.includes(genre as never))
      .sort();
    const genreOrder = [...CERTIFICATION_GENRE_ORDER, ...remainingGenres];

    for (const genre of genreOrder) {
      const names = grouped.get(genre);
      if (!names || names.size === 0) continue;

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

window.addEventListener("DOMContentLoaded", () => new LocalStarsApp());
