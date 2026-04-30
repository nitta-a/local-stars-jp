export type ViewToggleMode = "card" | "compact";

const DEFAULT_LABEL = "表示形式の切り替え";

export class ViewToggle extends HTMLElement {
  private currentMode: ViewToggleMode = "card";

  connectedCallback() {
    if (this.childElementCount === 0) {
      this.render();
    }

    this.addEventListener("click", this.handleClick);
    this.setMode(this.currentMode);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
  }

  setMode(mode: ViewToggleMode) {
    this.currentMode = mode;

    this.querySelectorAll<HTMLButtonElement>("[data-view-mode]").forEach((button) => {
      const isActive = button.dataset.viewMode === mode;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  private readonly handleClick = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const button = target.closest<HTMLButtonElement>("[data-view-mode]");
    if (!button) {
      return;
    }

    const mode = button.dataset.viewMode;
    if (mode !== "card" && mode !== "compact") {
      return;
    }

    if (mode === this.currentMode) {
      return;
    }

    this.setMode(mode);
    this.dispatchEvent(
      new CustomEvent<ViewToggleMode>("viewchange", {
        bubbles: true,
        detail: mode,
      }),
    );
  };

  private render() {
    const label = this.getAttribute("aria-label") ?? DEFAULT_LABEL;
    this.innerHTML = `
      <div class="view-toggle-group" role="group" aria-label="${label}">
        <button type="button" class="view-toggle-btn active" data-view-mode="card" aria-pressed="true">カード</button>
        <button type="button" class="view-toggle-btn" data-view-mode="compact" aria-pressed="false">コンパクト</button>
      </div>
    `;
  }
}

if (!customElements.get("local-view-toggle")) {
  customElements.define("local-view-toggle", ViewToggle);
}
