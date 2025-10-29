"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GraficoHistoricoDisp from "./GraficoHistoricoDisp";
import { HistoricoItem } from "../interfaces";

export default function RelatorioHistoricoDispRadares() {
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  const [qtdRegistros, setQtdRegistros] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchHistorico = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/relatorios/radares/historico-disp`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (!data.erro) {
          setHistorico(data.historico || []);
          setQtdRegistros(data.total_registros || 0);
        } else {
          toast.error(data.mensagem || "Erro ao carregar histórico.");
        }
      } catch (error: any) {
        toast.error(error.message || "Erro inesperado ao buscar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  if (loading) return <p>Carregando relatório...</p>;

  return (
    <div className="relatorio-bloco">
      {historico.length === 0 ? (
        <p className="placeholder">
          Ainda não há dados coletados para exibição.
        </p>
      ) : (
        <div className="relatorio-conteudo-flex">
          <GraficoHistoricoDisp historico={historico} qtdRegistros={qtdRegistros} />
        </div>
      )}
    </div>
  );
}
