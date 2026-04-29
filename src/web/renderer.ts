import type { Enterprise } from "../types/gbiz";
import { PREF_MAP, REGION_COLORS, REGION_GRID_LAYOUT, REGION_GROUPS } from "./constants";

export function buildCompanyCardHtml(c: Enterprise): string {
  return `
      <div class="company-card">
        <h3 class="company-name">${c.name}</h3>
        <p class="address">📍 <a href="https://maps.google.com/maps?q=${encodeURIComponent(c.address)}" target="_blank" rel="noopener noreferrer">${c.address}</a></p>
        <div class="certification-tags">
          ${c.certification.map((cert) => `<span class="tag">${cert.certification_name}</span>`).join("")}
        </div>
      </div>
    `;
}

const SVG_NS = "http://www.w3.org/2000/svg";
const CELL_W = 80;
const CELL_H = 52;
const GAP = 6;
const PAD = 10;

export function buildPrefSvg(
  regionIdx: number,
  selectedCode: string,
  onSelect: (code: string) => void,
): SVGSVGElement {
  const region = REGION_GROUPS[regionIdx];
  const layout = REGION_GRID_LAYOUT[regionIdx];
  const color = REGION_COLORS[regionIdx] ?? "#d0e8ff";

  const maxRow = Math.max(...layout.prefs.map((p) => p.row));
  const svgW = layout.cols * (CELL_W + GAP) - GAP + PAD * 2;
  const svgH = maxRow * (CELL_H + GAP) - GAP + PAD * 2;

  const svgEl = document.createElementNS(SVG_NS, "svg");
  svgEl.setAttribute("id", "pref-svg");
  svgEl.setAttribute("viewBox", `0 0 ${svgW} ${svgH}`);
  svgEl.setAttribute("role", "group");
  svgEl.setAttribute("aria-label", region.label);

  for (const cell of layout.prefs) {
    const x = PAD + (cell.col - 1) * (CELL_W + GAP);
    const y = PAD + (cell.row - 1) * (CELL_H + GAP);
    const name = PREF_MAP[cell.code] ?? cell.code;
    const isSelected = cell.code === selectedCode;

    const g = document.createElementNS(SVG_NS, "g");
    g.setAttribute("class", `pref-cell${isSelected ? " selected" : ""}`);
    g.setAttribute("data-code", cell.code);
    g.setAttribute("role", "button");
    g.setAttribute("tabindex", "0");
    g.setAttribute("aria-label", name);
    g.setAttribute("aria-pressed", String(isSelected));

    const rect = document.createElementNS(SVG_NS, "rect");
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("width", String(CELL_W));
    rect.setAttribute("height", String(CELL_H));
    rect.setAttribute("rx", "8");
    rect.setAttribute("fill", isSelected ? "var(--primary-color)" : color);
    rect.dataset.baseColor = color;

    const text = document.createElementNS(SVG_NS, "text");
    text.setAttribute("x", String(x + CELL_W / 2));
    text.setAttribute("y", String(y + CELL_H / 2 + 5));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", isSelected ? "white" : "#333");
    text.textContent = name;

    g.appendChild(rect);
    g.appendChild(text);
    g.addEventListener("click", () => onSelect(cell.code));
    g.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") onSelect(cell.code);
    });
    svgEl.appendChild(g);
  }

  return svgEl;
}
