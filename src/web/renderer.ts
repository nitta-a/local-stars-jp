import type { Enterprise, LaborData } from "../types/gbiz";
import { PREF_MAP, REGION_COLORS, REGION_GRID_LAYOUT, REGION_GROUPS } from "./constants";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildCertificationTags(c: Enterprise): string {
  return c.certification.map((cert) => `<span class="tag">${escapeHtml(cert.certification_name)}</span>`).join("");
}

function formatWithUnit(value: string | undefined, unit: string): string | null {
  if (!value) return null;
  return /[%年月日時分間人歳]$/.test(value) ? value : `${value}${unit}`;
}

function calculateRatio(numerator: string | undefined, denominator: string | undefined): string | null {
  if (!numerator || !denominator) return null;

  const num = Number(numerator);
  const den = Number(denominator);
  if (!Number.isFinite(num) || !Number.isFinite(den) || den <= 0) return null;

  return `${((num / den) * 100).toFixed(1)}%`;
}

function buildLaborSummaryItems(data: LaborData): Array<{ label: string; value: string }> {
  const items: Array<{ label: string; value: string | null }> = [
    {
      label: "女性比率",
      value: formatWithUnit(data.female_worker_ratio, "%"),
    },
    {
      label: "女性管理職比率",
      value: calculateRatio(data.female_manager_count, data.manager_total_count),
    },
    {
      label: "平均勤続",
      value:
        formatWithUnit(data.average_continuous_service_years_regular, "年") ??
        formatWithUnit(data.average_continuous_service_years_male, "年") ??
        formatWithUnit(data.average_continuous_service_years_female, "年"),
    },
    {
      label: "平均年齢",
      value: formatWithUnit(data.average_employee_age, "歳"),
    },
    {
      label: "月平均残業",
      value: formatWithUnit(data.monthly_overtime_hours, "時間"),
    },
  ];

  return items.filter((item): item is { label: string; value: string } => Boolean(item.value)).slice(0, 4);
}

function buildLaborSummaryHtml(data: LaborData | undefined, compact = false): string {
  if (!data) return "";

  const items = buildLaborSummaryItems(data);
  if (items.length === 0) return "";

  return `
    <section class="labor-summary${compact ? " labor-summary--compact" : ""}" aria-label="職場情報の要約">
      ${items
        .map(
          (item) => `
            <div class="labor-chip">
              <span class="labor-chip__label">${escapeHtml(item.label)}</span>
              <strong class="labor-chip__value">${escapeHtml(item.value)}</strong>
            </div>
          `,
        )
        .join("")}
    </section>
  `;
}

function buildLaborMetricRows(data: LaborData): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string | null }> = [
    { label: "平均継続勤務年数の対象", value: data.average_continuous_service_years_scope ?? null },
    { label: "平均継続勤務年数（男性）", value: formatWithUnit(data.average_continuous_service_years_male, "年") },
    { label: "平均継続勤務年数（女性）", value: formatWithUnit(data.average_continuous_service_years_female, "年") },
    { label: "正社員の平均継続勤務年数", value: formatWithUnit(data.average_continuous_service_years_regular, "年") },
    { label: "従業員の平均年齢", value: formatWithUnit(data.average_employee_age, "歳") },
    { label: "月平均所定外労働時間", value: formatWithUnit(data.monthly_overtime_hours, "時間") },
    { label: "女性労働者比率の対象", value: data.female_worker_ratio_scope ?? null },
    { label: "女性労働者比率", value: formatWithUnit(data.female_worker_ratio, "%") },
    {
      label: "女性管理職",
      value:
        data.female_manager_count && data.manager_total_count
          ? `${data.female_manager_count}人 / ${data.manager_total_count}人 (${calculateRatio(data.female_manager_count, data.manager_total_count) ?? "-"})`
          : formatWithUnit(data.female_manager_count, "人"),
    },
    {
      label: "女性役員",
      value:
        data.female_officer_count && data.officer_total_count
          ? `${data.female_officer_count}人 / ${data.officer_total_count}人 (${calculateRatio(data.female_officer_count, data.officer_total_count) ?? "-"})`
          : formatWithUnit(data.female_officer_count, "人"),
    },
    { label: "育休対象者数（男性）", value: formatWithUnit(data.childcare_leave_eligible_male, "人") },
    { label: "育休対象者数（女性）", value: formatWithUnit(data.childcare_leave_eligible_female, "人") },
    { label: "育休取得者数（男性）", value: formatWithUnit(data.childcare_leave_taken_male, "人") },
    { label: "育休取得者数（女性）", value: formatWithUnit(data.childcare_leave_taken_female, "人") },
  ];

  return rows.filter((row): row is { label: string; value: string } => Boolean(row.value));
}

function buildLaborDetailsHtml(data: LaborData | undefined): string {
  if (!data) return "";

  const rows = buildLaborMetricRows(data);
  if (rows.length === 0) return "";

  return `
    <details class="labor-details">
      <summary>職場情報の詳細を見る</summary>
      <dl class="labor-metrics">
        ${rows
          .map(
            (row) => `
              <div class="labor-metrics__row">
                <dt>${escapeHtml(row.label)}</dt>
                <dd>${escapeHtml(row.value)}</dd>
              </div>
            `,
          )
          .join("")}
      </dl>
    </details>
  `;
}

export function buildCompanyCardHtml(c: Enterprise): string {
  const escapedName = escapeHtml(c.name);
  const escapedAddress = escapeHtml(c.address);
  const corporateNumber = escapeHtml(c.corporate_number);
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(c.address)}`;

  return `
      <div class="company-card">
        <div class="company-card__eyebrow">
          <span class="company-card__badge">認定 ${c.certification.length} 件</span>
          <span class="corporate-number">法人番号 ${corporateNumber}</span>
        </div>
        <h3 class="company-name">${escapedName}</h3>
        <p class="address">所在地 <a href="${mapUrl}" target="_blank" rel="noopener noreferrer">${escapedAddress}</a></p>
        ${buildLaborSummaryHtml(c.labor_data)}
        <div class="certification-tags">
          ${buildCertificationTags(c)}
        </div>
        ${buildLaborDetailsHtml(c.labor_data)}
        <div class="links">
          <a href="${mapUrl}" target="_blank" rel="noopener noreferrer">Google マップで見る</a>
        </div>
      </div>
    `;
}

export function buildCompanyCardCompactHtml(c: Enterprise): string {
  const escapedName = escapeHtml(c.name);
  const escapedAddress = escapeHtml(c.address);
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(c.address)}`;

  return `
      <div class="company-card company-card--compact">
        <div class="company-card__compact-main">
          <span class="company-name">${escapedName}</span>
          <span class="company-card__compact-address">${escapedAddress}</span>
        </div>
        <div class="company-card__compact-meta">
          <div class="certification-tags">
            ${buildCertificationTags(c)}
          </div>
          ${buildLaborSummaryHtml(c.labor_data, true)}
        </div>
        <div class="links">
          <a href="${mapUrl}" target="_blank" rel="noopener noreferrer">地図</a>
        </div>
      </div>
    `;
}

const SVG_NS = "http://www.w3.org/2000/svg";
const CELL_W = 80;
const CELL_H = 52;
const GAP = 6;
const PAD = 10;

export function buildPrefSvg(regionIdx: number, selectedCode: string, onSelect: (code: string) => void): SVGSVGElement {
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
