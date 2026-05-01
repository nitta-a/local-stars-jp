type TabKey = "map" | "list";

const DEFAULT_LABEL = "都道府県の選択方法";

export class TabSwitcher extends HTMLElement {
  private activeTab: TabKey = "map";

  connectedCallback() {
    if (this.childElementCount === 0) {
      this.render();
    }

    this.addEventListener("click", this.handleClick);
    this.setActiveTab(this.activeTab);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
  }

  setActiveTab(tab: TabKey) {
    this.activeTab = tab;

    this.querySelectorAll<HTMLButtonElement>("[data-tab-key]").forEach((button) => {
      const isActive = button.dataset.tabKey === tab;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    this.togglePanels(tab);
  }

  private readonly handleClick = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest<HTMLButtonElement>("[data-tab-key]");
    if (!button) {
      return;
    }

    const tab = button.dataset.tabKey;
    if (tab !== "map" && tab !== "list") {
      return;
    }

    if (tab === this.activeTab) {
      return;
    }

    this.setActiveTab(tab);
  };

  private togglePanels(activeTab: TabKey) {
    this.querySelectorAll<HTMLButtonElement>("[data-tab-key]").forEach((button) => {
      const panelId = button.getAttribute("aria-controls");
      if (!panelId) {
        return;
      }

      const panel = document.getElementById(panelId);
      if (!panel) {
        return;
      }

      panel.hidden = button.dataset.tabKey !== activeTab;
    });
  }

  private render() {
    const label = this.getAttribute("aria-label") ?? DEFAULT_LABEL;
    this.innerHTML = `
      <div class="tab-nav" role="tablist" aria-label="${label}">
        <button class="tab-btn active" role="tab" aria-controls="tab-panel-map" aria-selected="true" type="button" data-tab-key="map">
          🗾 地図から選ぶ
        </button>
        <button class="tab-btn" role="tab" aria-controls="tab-panel-list" aria-selected="false" type="button" data-tab-key="list">
          📋 一覧から選ぶ
        </button>
      </div>
    `;
  }
}

if (!customElements.get("local-tab-switcher")) {
  customElements.define("local-tab-switcher", TabSwitcher);
}
