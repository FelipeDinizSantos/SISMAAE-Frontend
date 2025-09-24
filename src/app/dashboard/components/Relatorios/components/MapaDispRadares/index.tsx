"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

import "./MapaDispRadares.css";

const geoUrl =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

const regioes: Record<string, number> = {
  "Acre": 1, "Amazonas": 1, "Rondônia": 1, "Roraima": 1, "Pará": 1, "Amapá": 1, "Maranhão": 1,

  "Tocantins": 2, "Piauí": 2, "Ceará": 2, "Rio Grande do Norte": 2, "Paraíba": 2, "Pernambuco": 2,
  "Alagoas": 2, "Sergipe": 2, "Bahia": 2, "Mato Grosso": 2, "Goiás": 2, "Distrito Federal": 2,

  "Minas Gerais": 4, "São Paulo": 4,

  "Santa Catarina": 5, "Rio Grande do Sul": 5,

  "Rio de Janeiro": 6, "Espírito Santo": 6,

  "Paraná": 7, "Mato Grosso do Sul": 7,
};

const cores = [
  "#ff9999", "#99ccff", "#99ff99", "#ffcc99", "#c299ff", "#ffeb99", "#4ef823ff",
];

const divisoesCoords: { id: number; nome: string; coords: [number, number]; total: number; ativos: number }[] = [
  { id: 1, nome: "Divisão 1", coords: [-63, -5], total: 5, ativos: 2 },
  { id: 2, nome: "Divisão 2", coords: [-50, -12], total: 6, ativos: 3 },
  { id: 4, nome: "Divisão 4", coords: [-47, -22], total: 4, ativos: 1 },
  { id: 5, nome: "Divisão 5", coords: [-52, -28], total: 5, ativos: 4 },
  { id: 6, nome: "Divisão 6", coords: [-42, -21], total: 3, ativos: 2 },
  { id: 7, nome: "Divisão 7", coords: [-54.5, -20], total: 4, ativos: 0 },
];

export default function MapaDispRadares() {
  const [hoverDiv, setHoverDiv] = useState<number | null>(null);

  return (
    <div className="mapa-container">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 700, center: [-55, -15] }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const nome = geo.properties.name as string;
              const regiaoId = regioes[nome] || 6;
              const corDivisao = cores[regiaoId - 1];

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={hoverDiv === regiaoId ? corDivisao : "#fff"}
                  stroke="#000"
                  strokeWidth={0.4}
                  onMouseEnter={() => setHoverDiv(regiaoId)}
                  onMouseLeave={() => setHoverDiv(null)}
                  cursor={"pointer"}
                />
              );
            })
          }
        </Geographies>

        {divisoesCoords.map((div) => (
          <Marker key={div.id} coordinates={div.coords}>
            <text
              textAnchor="middle"
              y={5}
              style={{
                fontFamily: "Arial",
                fontSize: 14,
                fontWeight: "bold",
                fill: "#000",
                stroke: "#fff",
                strokeWidth: 0.5,
              }}
            >
              {div.nome}
            </text>

            {Array.from({ length: div.total }).map((_, i) => (
              <circle
                key={i}
                cx={i * 12 - (div.total * 6)}
                cy={20}
                r={5}
                fill={i < div.ativos ? "#007bff" : "#fff"}
                stroke="#000"
                strokeWidth={0.6}
                cursor={"pointer"}
              />
            ))}
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
