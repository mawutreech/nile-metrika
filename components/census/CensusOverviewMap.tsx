"use client";

import { useEffect, useMemo, useState } from "react";
import { GeoJSON, MapContainer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type CountyPopulationRow = {
  id: string;
  name: string;
  slug: string;
  population: number | null;
  parent_name: string | null;
};

type GeoJsonFeature = {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: unknown;
};

type GeoJsonData = {
  type: "FeatureCollection";
  features: GeoJsonFeature[];
};

function normalizeName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\//g, " / ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ");
}

const COUNTY_NAME_ALIASES: Record<string, string> = {
  bor: "bor south",
  "bor south": "bor south",

  lafon: "lopa",
  lopa: "lopa",

  raga: "raja",
  raja: "raja",

  yei: "yei river",
  "yei river": "yei river",

  "canal / pigi": "canal/pigi",
  "canal/pigi": "canal/pigi",
  "pigi / canal": "canal/pigi",
  "pigi/canal": "canal/pigi",
};

function getCanonicalCountyName(value: string) {
  const normalized = normalizeName(value);
  return COUNTY_NAME_ALIASES[normalized] || normalized;
}

function formatPopulation(value: number | null) {
  if (value === null || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US").format(value);
}

function getFillColor(value: number | null, max: number) {
  if (value === null || max <= 0) return "#e5e7eb";

  const ratio = value / max;

  if (ratio > 0.85) return "#166534";
  if (ratio > 0.65) return "#15803d";
  if (ratio > 0.45) return "#22c55e";
  if (ratio > 0.25) return "#84cc16";
  if (ratio > 0.1) return "#bef264";
  return "#dcfce7";
}

const LeafletMapContainer = MapContainer as unknown as React.ComponentType<any>;
const LeafletGeoJSON = GeoJSON as unknown as React.ComponentType<any>;

export function CensusOverviewMap({
  counties,
}: {
  counties: CountyPopulationRow[];
}) {
  const [geojson, setGeojson] = useState<GeoJsonData | null>(null);

  useEffect(() => {
    fetch("/data/south-sudan-counties.geojson")
      .then((res) => res.json())
      .then((data) => setGeojson(data))
      .catch(() => setGeojson(null));
  }, []);

  const countyMap = useMemo(() => {
    return new Map(
      counties.map((county) => [getCanonicalCountyName(county.name), county])
    );
  }, [counties]);

  const maxPopulation = useMemo(() => {
    return Math.max(
      0,
      ...counties.map((c) =>
        typeof c.population === "number" ? c.population : 0
      )
    );
  }, [counties]);

  const mapBounds = useMemo(() => {
    if (!geojson) return null;
    const layer = L.geoJSON(geojson as any);
    return layer.getBounds();
  }, [geojson]);

  if (!geojson || !mapBounds) {
    return (
      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        County map could not be loaded. Check that the file exists at{" "}
        <code>public/data/south-sudan-counties.geojson</code>.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          County population map
        </h2>
      </div>

      <div className="h-[720px] w-full bg-white">
        <LeafletMapContainer
          bounds={mapBounds}
          boundsOptions={{ padding: [8, 8] }}
          scrollWheelZoom={true}
          zoomControl={true}
          className="h-full w-full"
          style={{ background: "#ffffff" }}
        >
          <LeafletGeoJSON
            data={geojson}
            style={(feature: GeoJsonFeature) => {
              const countyName = getCanonicalCountyName(
                String(feature?.properties?.ADM2_EN || "")
              );

              const county = countyMap.get(countyName);
              const population = county?.population ?? null;

              return {
                color: "#475569",
                weight: 1.2,
                fillColor: getFillColor(population, maxPopulation),
                fillOpacity: 0.85,
              };
            }}
            onEachFeature={(feature: GeoJsonFeature, layer: any) => {
              const geoCountyName = String(
                feature?.properties?.ADM2_EN || "Unknown county"
              );
              const geoStateName = String(
                feature?.properties?.ADM1_EN || "Unknown"
              );

              const county = countyMap.get(
                getCanonicalCountyName(geoCountyName)
              );

              const name = county?.name || geoCountyName;
              const parent = county?.parent_name || geoStateName;
              const population = county?.population ?? null;

              layer.bindTooltip(
                `
                  <div style="min-width: 170px">
                    <strong>${name}</strong><br/>
                    ${parent}<br/>
                    Population: ${formatPopulation(population)}
                  </div>
                `,
                {
                  sticky: true,
                }
              );

              layer.bindTooltip(name, {
                permanent: true,
                direction: "center",
                className: "county-name-label",
                opacity: 0.9,
              });
            }}
          />
        </LeafletMapContainer>
      </div>
    </div>
  );
}