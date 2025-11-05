import "../styles.css";

import { Material } from "@/interfaces/Material.interface";
import { Modulo } from "@/interfaces/Modulo.interface";
import { useEffect, useState, useMemo } from "react";

import toast from "react-hot-toast";
import GraficoStatus from "@/components/GraficoStatus";
import MapaDisponibilidadeRadares from "./MapaDisponibilidadeRadares";

export default function RelatorioDisponibilidade() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMateriais = async () => {
      try {
        const res = await fetch(`/api/materiais/`);
        const data = await res.json();
        setMateriais(data.materiais || []);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Ocorreu um erro inesperado!");
        }
      }
    };

    fetchMateriais();

    const fetchModulos = async () => {
      try {
        const res = await fetch(`/api/modulos/`);
        const data = await res.json();
        setModulos(data.modulos || []);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Ocorreu um erro inesperado!");
        }
      }
    };

    fetchModulos();
    setLoading(false);
  }, []);

  const indicesMateriais = useMemo(() => {
    const total = materiais.length;
    const disponiveis = materiais.filter(
      (m) => m.Disponibilidade === "DISPONIVEL"
    ).length;
    const restricao = materiais.filter(
      (m) => m.Disponibilidade === "DISP_C_RESTRICAO"
    ).length;
    const indisponiveis = materiais.filter(
      (m) => m.Disponibilidade === "INDISPONIVEL"
    ).length;
    const manutencao = materiais.filter(
      (m) => m.Disponibilidade === "MANUTENCAO"
    ).length;

    return { total, disponiveis, restricao, indisponiveis, manutencao };
  }, [materiais]);

  const indispPorModulos = useMemo(() => {
    const ignorar = ["ANTENA", "CAIXA DE BATERIAS", "GERADOR", "CABEAMENTO"];

    const renomear: Record<string, string> = {
      PEDESTAL: "Pedestal",
      QUADRIPE: "Quadripé",
    };

    const modulosMap = modulos.reduce<
      Record<string, { nome: string; qtd: number; total: number }>
    >((acc, mod) => {
      let nome = mod.modulo?.toUpperCase();
      if (!nome) return acc;

      if (ignorar.includes(nome)) return acc;

      const nomeFormatado = renomear[nome] || nome;

      if (!acc[nomeFormatado]) {
        acc[nomeFormatado] = { nome: nomeFormatado, qtd: 0, total: 0 };
      }

      acc[nomeFormatado].total++;

      if (
        mod.Disponibilidade === "INDISPONIVEL" ||
        mod.Disponibilidade === "MANUTENCAO"
      ) {
        acc[nomeFormatado].qtd++;
      }

      return acc;
    }, {});

    const modulosLista = Object.values(modulosMap);

    const totalModulosIndisp = modulosLista.reduce(
      (soma, m) => soma + m.qtd,
      0
    );

    return { modulosLista, totalModulosIndisp };
  }, [modulos]);

  const percent = (valor: number, total: number) =>
    total > 0 ? ((valor / total) * 100).toFixed(1) + "%" : "-";

  if (loading) {
    return <p>Montando relatório ...</p>;
  } else {
    return (
      <div className="relatorio-bloco">
        {/* --- Materiais --- */}
        <div className="relatorio-conteudo-flex">
          <>
            <div className="grafico-area">
              <GraficoStatus
                itens={materiais}
                titulo="Relação de Disponibilidades"
              />
            </div>
            <div className="indices-area">
              <h3>Índice de Radares</h3>
              <ul>
                <li>
                  <span className="cor disponivel"></span> Disponíveis:{" "}
                  <strong>{indicesMateriais.disponiveis}</strong>{" "}
                  <em>
                    {percent(
                      indicesMateriais.disponiveis,
                      indicesMateriais.total
                    )}
                  </em>
                </li>
                <li>
                  <span className="cor restricao"></span> Disp. c/ Restrição:{" "}
                  <strong>{indicesMateriais.restricao}</strong>{" "}
                  <em>
                    {percent(
                      indicesMateriais.restricao,
                      indicesMateriais.total
                    )}
                  </em>
                </li>
                <li>
                  <span className="cor indisponivel"></span> Indisponíveis:{" "}
                  <strong>{indicesMateriais.indisponiveis}</strong>{" "}
                  <em>
                    {percent(
                      indicesMateriais.indisponiveis,
                      indicesMateriais.total
                    )}
                  </em>
                </li>
                <li>
                  <span className="cor manutencao"></span> Em Manutenção:{" "}
                  <strong>{indicesMateriais.manutencao}</strong>{" "}
                  <em>
                    {percent(
                      indicesMateriais.manutencao,
                      indicesMateriais.total
                    )}
                  </em>
                </li>
                <li className="total">
                  Total: <strong>{indicesMateriais.total}</strong>
                </li>
              </ul>
            </div>
          </>
        </div>

        {/* indispPorModulos */}
        <div className="relatorio-conteudo-flex">
          <div className="indices-area">
            <h3>Indisponibilidade de Módulos</h3>
            <ul>
              {indispPorModulos.modulosLista.map(
                (modulo: { nome: string; qtd: number; total: number }) => {
                  return (
                    <li key={modulo.nome}>
                      <span className="cor indisponivel"></span> {modulo.nome}:{" "}
                      <strong>{modulo.qtd}</strong>{" "}
                      <em>{percent(modulo.qtd, modulo.total)}</em>
                    </li>
                  );
                }
              )}

              <li className="total">
                Total: <strong>{indispPorModulos.totalModulosIndisp}</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Mapa --- */}
        <div className="mapa-conteudo">
          <h3>Mapa de Disponibilidade de Radares</h3>
          <MapaDisponibilidadeRadares />
        </div>
      </div>
    );
  }
}
