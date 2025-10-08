"use client";

import "../styles.css";

import { useEffect, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { regiao } from "@/interfaces/Regiao.interface";
import toast from "react-hot-toast";

const geoUrl = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

const regioes: Record<string, number> = {
  "Acre": 1, "Amazonas": 1, "Rondônia": 1, "Roraima": 1, "Pará": 1, "Amapá": 1, "Maranhão": 1,

  "Tocantins": 2, "Goiás": 2, "Piauí": 2, "Ceará": 2, "Rio Grande do Norte": 2, "Paraíba": 2, "Pernambuco": 2,
  "Alagoas": 2, "Sergipe": 2, "Bahia": 2, "Distrito Federal": 2, "Minas Gerais": 2,

  "Mato Grosso": 3, "Mato Grosso do Sul": 3,

  "São Paulo": 4,

  "Rio de Janeiro": 5, "Espírito Santo": 5,

  "Paraná": 6, "Santa Catarina": 6, "Rio Grande do Sul": 6,
};

const cores = [
  "#83da83ff", "#d0d27eff", "#99ff99", "#b2b3c3ff", "#9b9ceaff", "#696be9ff",
];

export default function MapaDisponibilidadeRadares() {
  const [hoverDiv, setHoverDiv] = useState<number | null>(null);
  const [divisoesCoords, setDivisoesCoords] = useState<{ id: number; nome: string; coords: [number, number]; total: number; ativos: number }[]>(
    [
      { id: 1, nome: "Norte", coords: [-58, -3], total: 0, ativos: 0 },
      { id: 2, nome: "Planalto", coords: [-43, -12], total: 0, ativos: 0 },
      { id: 3, nome: "Oeste", coords: [-55, -15], total: 0, ativos: 0 },
      { id: 4, nome: "Sudeste", coords: [-49, -22], total: 0, ativos: 0 },
      { id: 5, nome: "Leste", coords: [-38, -21], total: 0, ativos: 0 },
      { id: 6, nome: "Sul", coords: [-51, -26], total: 0, ativos: 0 },
    ]
  );

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      try {
        let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/relatorios/radares/disp-por-regiao`, {
          headers: { authorization: `Bearer ${token}` }
        });

        let data = await res.json();
        let regioes: regiao[] = data.regioes;

        let novasDivisoes = [...divisoesCoords];

        novasDivisoes.map((div, index) => {
          regioes.forEach((regiao) => {
            if (regiao.nome === div.nome.toUpperCase()) {
              novasDivisoes[index] = {
                ...div,
                total: regiao.total,
                ativos: regiao.ativos
              };
            }
          });
        });

        setDivisoesCoords(novasDivisoes);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Ocorreu um erro inesperado!");
        }
      }
    }

    fetchData();
  }, []);

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
                cx={i * 12 - (div.total * 4)}
                cy={20}
                r={5}
                fill={i < div.ativos ? "#14cd4fff" : "#ce4444ff"}
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
