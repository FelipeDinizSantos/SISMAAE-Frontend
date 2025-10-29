"use client";

import "rc-slider/assets/index.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useMemo } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { GraficoHistoricoDispProps } from "../interfaces";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GraficoHistoricoDisp({
  historico,
  qtdRegistros
}: GraficoHistoricoDispProps) {
  const anosDisponiveis = Array.from(
    new Set(historico.map((h) => new Date(h.timestamp).getFullYear()))
  ).sort((a, b) => a - b);

  const anoMin = anosDisponiveis[0];
  const anoMax = anosDisponiveis[anosDisponiveis.length - 1];
  const anoAtual = new Date().getFullYear();

  const [range, setRange] = useState<[number, number]>([anoAtual, anoAtual]);

  const historicoFiltrado = useMemo(
    () =>
      historico.filter((h) => {
        const ano = new Date(h.timestamp).getFullYear();
        return ano >= range[0] && ano <= range[1];
      }),
    [historico, range]
  );

  const labels = historicoFiltrado.map((h) =>
    new Date(h.timestamp).toLocaleString("pt-BR", {
      month: "short",
      year: "2-digit",
    })
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Disponíveis",
        data: historicoFiltrado.map((h) => h.status.DISPONIVEL),
        borderColor: "#4caf50",
        backgroundColor: "#4caf5044",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Disp. c/ Restrição",
        data: historicoFiltrado.map((h) => h.status.DISP_C_RESTRICAO),
        borderColor: "#ffc107",
        backgroundColor: "#ffc10744",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Indisponíveis",
        data: historicoFiltrado.map((h) => h.status.INDISPONIVEL),
        borderColor: "#f44336",
        backgroundColor: "#f4433644",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Manutenção",
        data: historicoFiltrado.map((h) => h.status.MANUTENCAO),
        borderColor: "#2196f3",
        backgroundColor: "#2196f344",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" as const },
      title: {
        display: true,
        text: `Histórico de Disponibilidade (${range[0]}–${range[1]})`,
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="grafico-historico-disp-container">
      <div className="grafico-controles">
        <div className="grafico-controles-header">
          <span className="grafico-label">Período de observação</span>
          <span className="grafico-label">Registros encontrados: {qtdRegistros}</span>
          <span className="grafico-range">
            {range[0]} – {range[1]}
          </span>
        </div>

        <Slider
          range
          min={anoMin}
          max={anoMax}
          defaultValue={[anoAtual, anoAtual]}
          value={range}
          onChange={(value) => setRange(value as [number, number])}
          trackStyle={[{ backgroundColor: "#4caf50" }]}
          handleStyle={[
            { borderColor: "#4caf50", backgroundColor: "#fff" },
            { borderColor: "#4caf50", backgroundColor: "#fff" },
          ]}
          railStyle={{ backgroundColor: "#e0e0e0" }}
          step={1}
          marks={anosDisponiveis.reduce(
            (acc, ano) => ({ ...acc, [ano]: ano.toString() }),
            {}
          )}
        />
      </div>

      <Line options={options} data={data} />
    </div>
  );
}
