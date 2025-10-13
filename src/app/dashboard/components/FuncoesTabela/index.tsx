import "./FuncoesTabela.css";

import { CiAlignLeft as Order, CiRedo as ReloadIcon } from "react-icons/ci";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

export default function FuncoesTabela<T extends { Disponibilidade: "DISPONIVEL" | "INDISPONIVEL" | "DISP_C_RESTRICAO" | "MANUTENCAO" }>({
    handleReload,
    itensEditaveis,
    setItensEditaveis
}
    :
    {
        handleReload: () => void;
        itensEditaveis: T[];
        setItensEditaveis: Dispatch<SetStateAction<T[]>>;
    }) {
    const [animandoBtnRecarregamento, setAnimandoBtnRecarregamento] = useState(false);

    const handleRecarregamentoClick = () => {
        setAnimandoBtnRecarregamento(true);
        handleReload();

        toast.success("Dados atualizados");
        setTimeout(() => setAnimandoBtnRecarregamento(false), 600);
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

    return (
        <div className="menu-manip-container">
            <button
                className={`menu-btn ${animandoBtnRecarregamento ? "spin" : ""}`}
                onClick={handleRecarregamentoClick}
                title="Atualizar lista"
            >
                <ReloadIcon />
            </button>
            <button
                className={`menu-btn`}
                onClick={handleOrdenarClick}
                title="Ordernar por disponibilidade"
            >
                <Order />
            </button>
        </div>
    );
}
