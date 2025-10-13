"use client";

import "../styles.css";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import RelatorioDisponibilidade from "./RelatorioDisponibilidade";
import { Relatorio } from "../interfaces";

const relatoriosDisponiveis: Relatorio[] = [
  {
    id: "relatorio-disp-radares",
    nome: "Relatório Disponibilidade de Radares",
    descricao: "Resumo da disponibilidade de radares",
    componente: <RelatorioDisponibilidade />,
    disponivelPara: ["COL"],
  },
  {
    id: "relatorio-disp-modulos",
    nome: "Relatório Disponibilidade de Módulos",
    descricao: "Resumo da disponibilidade de módulos",
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
              className={`relatorio-card ${relatorioSelecionado === relatorio.id ? "ativo" : ""
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
