import "./FuncoesTabela.css";
import { CiAlignLeft as Order, CiRedo as ReloadIcon } from "react-icons/ci";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

export default function FuncoesTabela<
  T extends {
    Disponibilidade:
      | "DISPONIVEL"
      | "INDISPONIVEL"
      | "DISP_C_RESTRICAO"
      | "MANUTENCAO";
    SN: string;
  }
>({
  handleReload,
  itensEditaveis,
  setItensEditaveis,
}: {
  handleReload: () => void;
  itensEditaveis: T[];
  setItensEditaveis: Dispatch<SetStateAction<T[]>>;
}) {
  const [ordemSnAscendente, setOrdemSnAscendente] = useState(true);

  const handleRecarregamentoClick = () => {
    handleReload();
    toast.success("Dados atualizados");
  };

  const handleOrdenarClick = () => {
    const ordemDisponibilidade: Record<string, number> = {
      DISPONIVEL: 1,
      INDISPONIVEL: 2,
      DISP_C_RESTRICAO: 3,
      MANUTENCAO: 4,
    };

    const materiaisOrdenados = [...itensEditaveis].sort((a, b) => {
      const ordemA = ordemDisponibilidade[a.Disponibilidade] ?? 999;
      const ordemB = ordemDisponibilidade[b.Disponibilidade] ?? 999;
      return ordemA - ordemB;
    });

    setItensEditaveis(materiaisOrdenados);
    toast.success("Lista ordenada por disponibilidade");
  };

  const handleOrdenarSnClick = () => {
    // Ordena alfabeticamente pelo campo SN
    const materiaisOrdenados = [...itensEditaveis].sort((a, b) => {
      const snA = a.SN?.toUpperCase() ?? "";
      const snB = b.SN?.toUpperCase() ?? "";
      return ordemSnAscendente
        ? snA.localeCompare(snB, "pt-BR", { numeric: true })
        : snB.localeCompare(snA, "pt-BR", { numeric: true });
    });

    setItensEditaveis(materiaisOrdenados);
    setOrdemSnAscendente(!ordemSnAscendente);

    toast.success(
      `Lista ordenada por número de série (${
        ordemSnAscendente ? "A–Z" : "Z–A"
      })`
    );
  };

  return (
    <div className="menu-manip-container">
      <button
        className={`menu-btn`}
        onClick={handleRecarregamentoClick}
        title="Atualizar lista"
      >
        <ReloadIcon />
      </button>

      <button
        className="menu-btn"
        onClick={handleOrdenarClick}
        title="Ordenar por disponibilidade"
      >
        <Order />
      </button>

      <button
        className="menu-btn"
        onClick={handleOrdenarSnClick}
        title="Ordenar por número de série"
      >
        SN
      </button>
    </div>
  );
}
