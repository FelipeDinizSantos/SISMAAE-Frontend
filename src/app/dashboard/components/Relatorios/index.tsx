"use client";

import { useState } from "react";
import "./Relatorios.css";
import RelatorioDisponibilidade from "./components/RelatorioDisponibilidade";

interface Relatorio {
  id: string;
  nome: string;
  descricao: string;
  componente: React.ReactNode;
}

const relatoriosDisponiveis: Relatorio[] = [
  {
    id: "relatorio-disp-radares",
    nome: "Relatório de Disponibilidade",
    descricao: "Resumo da disponibilidade de radares",
    componente: <RelatorioDisponibilidade />,
  },
];

export default function Relatorios() {
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<string | null>(null);

  const relatorioAtivo = relatoriosDisponiveis.find(
    (r) => r.id === relatorioSelecionado
  );

  return (
    <div className="relatorios-container">
      <div className="relatorios-lista">
        {relatoriosDisponiveis.map((relatorio) => (
          <div
            key={relatorio.id}
            className={`relatorio-card ${relatorioSelecionado === relatorio.id ? "ativo" : ""
              }`}
            onClick={() => setRelatorioSelecionado(relatorio.id)}
          >
            <h3>{relatorio.nome}</h3>
            <p>{relatorio.descricao}</p>
          </div>
        ))}
      </div>

      <div className="relatorio-conteudo">
        {relatorioAtivo ? (
          <div className="relatorio-detalhes">
            <h2>{relatorioAtivo.nome}</h2>
            <p>{relatorioAtivo.descricao}</p>
            {relatorioAtivo.componente}
          </div>
        ) : (
          <p className="placeholder">Selecione um relatório para visualizar.</p>
        )}
      </div>
    </div>
  );
}
