import "./FuncoesTabela.css";
import {
  LuRefreshCcw as ReloadIcon,
  LuListFilter as DisponibilidadeIcon,
  LuListOrdered as SerieIcon,
  LuSearch as SearchIcon,
} from "react-icons/lu";
import { Dispatch, SetStateAction, useState, useEffect, useRef } from "react";
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
  const [busca, setBusca] = useState("");
  const [itensOriginais, setItensOriginais] = useState<T[]>([]);
  const primeiraRenderizacao = useRef(true);

  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      setItensOriginais(itensEditaveis);
      return;
    }

    if (!busca.trim()) {
      setItensOriginais(itensEditaveis);
    }
  }, [itensEditaveis]);

  useEffect(() => {
    if (!busca.trim()) {
      setItensEditaveis(itensOriginais);
      return;
    }

    const termo = busca.toLowerCase();
    const filtrados = itensOriginais.filter((item) =>
      item.SN?.toLowerCase().includes(termo)
    );
    setItensEditaveis(filtrados);
  }, [busca]);

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
      `Lista ordenada por número de série (${ordemSnAscendente ? "A–Z" : "Z–A"
      })`
    );
  };

  return (
    <div className="menu-manip-container">
      <button
        className="menu-btn"
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
        <DisponibilidadeIcon />
      </button>

      <button
        className="menu-btn"
        onClick={handleOrdenarSnClick}
        title="Ordenar por número de série"
      >
        <SerieIcon />
      </button>

      <div className="menu-search">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por SN"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
    </div>
  );
}
