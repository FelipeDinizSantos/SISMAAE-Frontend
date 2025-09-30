"use client";

import { useState } from "react";
import "./Relatorios.css";
import RelatorioDisponibilidade from "./components/RelatorioDisponibilidade";
import { useAuth } from "@/context/AuthContext";

interface Relatorio {
  id: string;
  nome: string;
  descricao: string;
  componente: React.ReactNode;
  disponivelPara: string[];
}

const relatoriosDisponiveis: Relatorio[] = [
  {
    id: "relatorio-disp-radares",
    nome: "Relatório de Disponibilidade",
    descricao: "Resumo da disponibilidade de radares",
    componente: <RelatorioDisponibilidade />,
    disponivelPara: ["COL"],
  },
];

export default function Relatorios() {
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<string | null>(null);
  const { user } = useAuth();

  const relatoriosPermitidos = relatoriosDisponiveis.filter((r) =>
    user ? r.disponivelPara.includes(user.perfil) : false
  );

  const relatorioAtivo = relatoriosPermitidos.find(
    (r) => r.id === relatorioSelecionado
  );

  return (
    <div className="relatorios-container">
      <div className="relatorios-lista">
        {relatoriosPermitidos.length > 0 ? (
          relatoriosPermitidos.map((relatorio) => (
            <div
              key={relatorio.id}
              className={`relatorio-card ${
                relatorioSelecionado === relatorio.id ? "ativo" : ""
              }`}
              onClick={() => setRelatorioSelecionado(relatorio.id)}
            >
              <h3>{relatorio.nome}</h3>
              <p>{relatorio.descricao}</p>
            </div>
          ))
        ) : (
          <p className="sem-acesso">
            Você não tem acesso a nenhum relatório disponível.
          </p>
        )}
      </div>

      <div className="relatorio-conteudo">
        {relatorioAtivo ? (
          <div className="relatorio-detalhes">
            <h2>{relatorioAtivo.nome}</h2>
            <p>{relatorioAtivo.descricao}</p>
            {relatorioAtivo.componente}
          </div>
        ) : (
          relatoriosPermitidos.length > 0 && (
            <p className="placeholder">Selecione um relatório para visualizar.</p>
          )
        )}
      </div>
    </div>
  );
}
