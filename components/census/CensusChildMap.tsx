"use client";

import { useEffect, useMemo, useState } from "react";
import { GeoJSON, MapContainer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type ChildRow = {
  id: string;
  name: string;
  slug: string;
  type: string | null;
  population: number | null;
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

export function CensusChildMap({
  title,
  childrenRows,
}: {
  title: string;
  childrenRows: ChildRow[];
}) {
  const [geojson, setGeojson] = useState<GeoJsonData | null>(null);

  useEffect(() => {
    fetch("/data/south-sudan-counties.geojson")
      .then((res) => res.json())
      .then((data) => setGeojson(data))
      .catch(() => setGeojson(null));
  }, []);

  const childMap = useMemo(() => {
    return new Map(
      childrenRows.map((row) => [getCanonicalCountyName(row.name), row])
    );
  }, [childrenRows]);

  const filteredGeojson = useMemo(() => {
    if (!geojson) return null;

    const features = geojson.features.filter((feature) => {
      const countyName = getCanonicalCountyName(
        String(feature?.properties?.ADM2_EN || "")
      );
      return childMap.has(countyName);
    });

    return {
      type: "FeatureCollection" as const,
      features,
    };
  }, [geojson, childMap]);

  const maxPopulation = useMemo(() => {
    return Math.max(
      0,
      ...childrenRows.map((row) =>
        typeof row.population === "number" ? row.population : 0
      )
    );
  }, [childrenRows]);

  const mapBounds = useMemo(() => {
    if (!filteredGeojson || filteredGeojson.features.length === 0) return null;
    const layer = L.geoJSON(filteredGeojson as any);
    return layer.getBounds();
  }, [filteredGeojson]);

  if (!filteredGeojson || !mapBounds || filteredGeojson.features.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      </div>

      <div className="h-[640px] w-full bg-white">
        <LeafletMapContainer
          bounds={mapBounds}
          boundsOptions={{ padding: [8, 8] }}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
          touchZoom={false}
          zoomControl={false}
          attributionControl={false}
          className="h-full w-full"
          style={{ background: "#ffffff" }}
        >
          <LeafletGeoJSON
            data={filteredGeojson}
            style={(feature: GeoJsonFeature) => {
              const countyName = getCanonicalCountyName(
                String(feature?.properties?.ADM2_EN || "")
              );
              const row = childMap.get(countyName);
              const population = row?.population ?? null;

              return {
                color: "#475569",
                weight: 1.2,
                fillColor: getFillColor(population, maxPopulation),
                fillOpacity: 0.85,
              };
            }}
            onEachFeature={(feature: GeoJsonFeature, layer: any) => {
              const geoCountyName = String(
                feature?.properties?.ADM2_EN || "Unknown"
              );
              const row = childMap.get(
                getCanonicalCountyName(geoCountyName)
              );

              const name = row?.name || geoCountyName;
              const population = row?.population ?? null;

              layer.bindTooltip(
                `
                  <div style="min-width: 160px">
                    <strong>${name}</strong><br/>
                    Population: ${formatPopulation(population)}
                  </div>
                `,
                { sticky: true }
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