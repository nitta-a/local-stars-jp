import type * as Leaflet from "leaflet";
import type { Enterprise } from "../types/gbiz";
import { PREF_COORDS } from "./constants";

declare const L: typeof Leaflet;

const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION = '\u00a9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

export class MapController {
  private map: Leaflet.Map | null = null;
  private markerLayer: Leaflet.LayerGroup | null = null;

  showMap(code: string): void {
    const coords = PREF_COORDS[code];
    if (!coords) return;
    const mapEl = document.getElementById("map") as HTMLElement;
    mapEl.hidden = false;
    if (this.map === null) {
      this.map = L.map("map").setView(coords, 10);
      L.tileLayer(TILE_URL, { maxZoom: 18, attribution: TILE_ATTRIBUTION }).addTo(this.map);
    } else {
      this.map.flyTo(coords, 10);
    }
    this.map.invalidateSize();
  }

  clearMarkers(): void {
    this.markerLayer?.clearLayers();
  }

  updateMarkers(companies: Enterprise[]): void {
    if (this.map === null) return;
    if (this.markerLayer === null) {
      this.markerLayer = L.layerGroup().addTo(this.map);
    }
    this.markerLayer.clearLayers();
    for (const c of companies) {
      if (c.lat !== undefined && c.lng !== undefined) {
        const tags = c.certification
          .map((cert) => `<span class="popup-tag">${cert.certification_name}</span>`)
          .join("");
        L.marker([c.lat, c.lng])
          .bindPopup(
            `<strong>${c.name}</strong><br><small>${c.address}</small>${tags ? `<div class="popup-tags">${tags}</div>` : ""}`,
          )
          .addTo(this.markerLayer);
      }
    }
  }
}
