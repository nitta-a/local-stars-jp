const twitterShareUrl = "https://twitter.com/intent/tweet?text={text}&url={url}";
const facebookShareUrl = "https://www.facebook.com/sharer/sharer.php?u={url}";
const lineShareUrl = "https://social-plugins.line.me/lineit/share?url={url}&text={text}";

const ERROR_COPY_FAILED = "リンクをコピーできませんでした。ブラウザの共有メニューを利用してください。";

export class SharePanel extends HTMLElement {
  private copyButton: HTMLButtonElement | null = null;
  private statusElement: HTMLElement | null = null;
  private shareXLink: HTMLAnchorElement | null = null;
  private shareFacebookLink: HTMLAnchorElement | null = null;
  private shareLineLink: HTMLAnchorElement | null = null;

  connectedCallback() {
    if (this.childElementCount === 0) {
      this.render();
    }

    this.classList.add("share-panel");
    this.copyButton = this.querySelector('[data-share="copy"]');
    this.statusElement = this.querySelector('[data-share="status"]');
    this.shareXLink = this.querySelector('[data-share="x"]');
    this.shareFacebookLink = this.querySelector('[data-share="facebook"]');
    this.shareLineLink = this.querySelector('[data-share="line"]');
    this.copyButton?.addEventListener("click", this.handleCopyClick);
  }

  disconnectedCallback() {
    this.copyButton?.removeEventListener("click", this.handleCopyClick);
  }

  updateShareLinks(url: string, text: string, status = "") {
    const encTxt = encodeURIComponent(text);
    const encUrl = encodeURIComponent(url);
    this.shareXLink?.setAttribute("href", twitterShareUrl.replace("{text}", encTxt).replace("{url}", encUrl));
    this.shareFacebookLink?.setAttribute("href", facebookShareUrl.replace("{url}", encUrl));
    this.shareLineLink?.setAttribute("href", lineShareUrl.replace("{url}", encUrl).replace("{text}", encTxt));

    if (this.statusElement) {
      this.statusElement.textContent = status;
    }
  }

  private readonly handleCopyClick = async () => {
    const shareUrl = window.location.href;

    try {
      await navigator.clipboard.writeText(shareUrl);
      this.updateShareLinks(shareUrl, this.getCurrentShareText(), "共有用リンクをコピーしました。");
    } catch (error) {
      console.error(error);
      this.updateShareLinks(shareUrl, this.getCurrentShareText(), ERROR_COPY_FAILED);
    }
  };

  private getCurrentShareText(): string {
    return this.dataset.shareText ?? document.title;
  }

  private render() {
    this.innerHTML = `
      <p class="share-panel__label">Share</p>
      <div class="share-panel__actions">
        <a class="share-link share-link--x share-link--icon-only" href="https://twitter.com/intent/tweet" target="_blank" rel="noopener noreferrer" aria-label="X で共有" data-share="x">
          <span class="share-link__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M18.244 2H21.5l-7.116 8.133L22.75 22h-6.554l-5.132-6.704L5.2 22H1.94l7.611-8.7L1.5 2h6.72l4.64 6.133L18.244 2Zm-1.142 18.05h1.804L7.28 3.852H5.344L17.102 20.05Z" fill="currentColor"/>
            </svg>
          </span>
          <span class="share-link__label">X</span>
        </a>
        <a class="share-link share-link--facebook" href="https://www.facebook.com/sharer/sharer.php" target="_blank" rel="noopener noreferrer" aria-label="Facebook で共有" data-share="facebook">
          <span class="share-link__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M13.647 22v-8.207h2.77l.415-3.2h-3.185V8.55c0-.927.257-1.56 1.588-1.56H16.96V4.126C16.124 4.037 15.283 3.993 14.442 4c-2.496 0-4.205 1.523-4.205 4.32v2.273H7.41v3.2h2.827V22h3.41Z" fill="currentColor"/>
            </svg>
          </span>
          <span class="share-link__label">Facebook</span>
        </a>
        <a class="share-link share-link--line" href="https://social-plugins.line.me/lineit/share" target="_blank" rel="noopener noreferrer" aria-label="LINE で共有" data-share="line">
          <span class="share-link__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M20.4 10.794c0-4.388-3.802-7.958-8.476-7.958S3.45 6.406 3.45 10.794c0 3.935 3.013 7.23 7.084 7.853.276.06.651.182.746.418.085.214.056.548.027.765l-.12.72c-.037.213-.17.835.73.455.9-.38 4.856-2.86 6.625-4.898 1.22-1.338 1.858-2.698 1.858-5.313Zm-11.3 2.166a.46.46 0 0 1-.46.46H6.065a.46.46 0 0 1-.46-.46V8.63a.46.46 0 1 1 .92 0v3.87H8.64a.46.46 0 0 1 .46.46Zm1.75 0a.46.46 0 0 1-.92 0V8.63a.46.46 0 1 1 .92 0v4.33Zm5.144 0a.46.46 0 0 1-.46.46.46.46 0 0 1-.355-.167l-2.238-2.84v2.547a.46.46 0 0 1-.92 0V8.63a.46.46 0 0 1 .46-.46c.138 0 .267.062.355.168l2.238 2.839V8.63a.46.46 0 1 1 .92 0v4.33Zm3.69-3.869h-2.115v1.028h2.115a.46.46 0 1 1 0 .92h-2.115v1.029h2.115a.46.46 0 1 1 0 .919h-2.575a.46.46 0 0 1-.46-.46V8.63a.46.46 0 0 1 .46-.46h2.575a.46.46 0 1 1 0 .92Z" fill="currentColor"/>
            </svg>
          </span>
          <span class="share-link__label">LINE</span>
        </a>
        <button class="share-link share-link--button share-link--copy" type="button" aria-label="共有リンクをコピー" data-share="copy">
          <span class="share-link__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
              <path d="M16 1H6a2 2 0 0 0-2 2v12h2V3h10V1Zm3 4H10a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H10V7h9v14Z" fill="currentColor"/>
            </svg>
          </span>
          <span class="share-link__label">リンクをコピー</span>
        </button>
      </div>
      <p class="share-panel__status" aria-live="polite" data-share="status"></p>
    `;
  }
}

if (!customElements.get("local-share-panel")) {
  customElements.define("local-share-panel", SharePanel);
}
