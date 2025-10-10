'use client';

import "./MenuLateral.css";

import { Material } from "@/interfaces/Material.interface";
import GraficoStatus from "../../../../components/GraficoStatus";
import { Modulo } from "@/interfaces/Modulo.interface";
import { Dispatch, SetStateAction, useState } from "react";
import { useBatalhao } from "@/hooks/useBatalhao";
import useCabides from "@/hooks/useCabides";

export default function MenuLateral({
    itens,
    setContextoLista,
    buscaGeral,
    setBuscaGeral,
    buscaEspecifica,
    setBuscaEspecifica,
    auxiliarBuscaEspecifica,
    setAuxiliarBuscaEspecifica
}:
    {
        itens: Material[] | Modulo[]
        setContextoLista: Dispatch<SetStateAction<string>>
        buscaGeral: "MODULO" | "MATERIAL" | "";
        setBuscaGeral: Dispatch<SetStateAction<"MODULO" | "MATERIAL" | "">>
        buscaEspecifica: string;
        setBuscaEspecifica: Dispatch<SetStateAction<string>>
        auxiliarBuscaEspecifica: string;
        setAuxiliarBuscaEspecifica: Dispatch<SetStateAction<string>>
    }) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const [filtroGeralValue, setFiltroGeralValue] = useState('');
    const { batalhoes } = useBatalhao(token);
    const { cabides } = useCabides(token);

    const opcoesModulos = [
        "antena",
        "CRF",
        "IFF",
        "pedestal",
        "UPS",
        "caixa de baterias",
        "quadripe",
        "UV",
        "cabeamento"
    ];

    const handleBuscaGeral = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setFiltroGeralValue(value);

        switch (value) {
            case "MODULO":
                setBuscaGeral("MODULO")
                break;
            case "MATERIAL":
                setBuscaGeral("MATERIAL")
                setContextoLista("MATERIAL")
                break;
            default:
                return;
        }

        setBuscaEspecifica('');
        setAuxiliarBuscaEspecifica('');
    };

    const handleBuscaEspecifica = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setBuscaEspecifica(event.target.value);

        switch (event.target.value) {
            case "NOME":
                setBuscaEspecifica("NOME");
                break;
            case "CABIDE":
                setBuscaEspecifica("CABIDE");
                break;
            case "ATUAL":
                setBuscaEspecifica("ATUAL");
                break;
            case "DISPONIBILIDADE":
                setBuscaEspecifica("DISPONIBILIDADE");
                break;
            default:
                setBuscaEspecifica('');
        }

        setAuxiliarBuscaEspecifica('');
    };

    const handleAuxiliarBuscaEspecifica = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAuxiliarBuscaEspecifica(event.target.value);

        if (buscaGeral === "MATERIAL") {
            if (buscaEspecifica === "ATUAL") setContextoLista("MATERIAL-ATUAL");
            if (buscaEspecifica === "DISPONIBILIDADE") setContextoLista("MATERIAL-DISPONIBILIDADE");
        }
        if (buscaGeral === "MODULO") {
            if (buscaEspecifica === "NOME") setContextoLista("MODULO-NOME");
            if (buscaEspecifica === "CABIDE") setContextoLista("MODULO-CABIDE");
            if (buscaEspecifica === "ATUAL") setContextoLista("MODULO-ATUAL");
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setBuscaEspecifica('');
        setAuxiliarBuscaEspecifica('');
        setFiltroGeralValue('');

        setContextoLista('MATERIAL');
        setBuscaGeral('MATERIAL');
    }

    return (
        <section className="menu-lateral">
            <h3>Filtros de Busca</h3>

            <form onSubmit={handleSubmit}>
                {/* Select 1 */}
                <label htmlFor="filtro-geral">Buscar por</label>
                <select
                    id="filtro"
                    name="filtro-geral"
                    onChange={handleBuscaGeral}
                    value={filtroGeralValue}
                >
                    <option value="MATERIAL">Materiais</option>
                    <option value="MODULO">Módulos</option>
                </select>

                {/* Select 2 */}
                <>
                    <label htmlFor="filtro-especifico">Método da busca</label>
                    <select 
                        id="filtro-especifico" 
                        name="filtro-especifico"
                        value={buscaEspecifica} 
                        onChange={handleBuscaEspecifica}>
                        <option value="">Selecione</option>
                        {buscaGeral === "MODULO" && (
                            <>
                                <option value="NOME">Nome</option>
                                <option value="CABIDE">Cabide</option>
                                <option value="ATUAL">OM Atual</option>
                            </>
                        )}
                        {buscaGeral === "MATERIAL" && (
                            <>
                                <option value="ATUAL">OM Atual</option>
                                <option value="DISPONIBILIDADE">Disponibilidade</option>
                            </>
                        )}
                    </select>
                </>

                {/* Select 3 - material - disponibilidade */}
                {buscaGeral === "MATERIAL" && buscaEspecifica === "DISPONIBILIDADE" && (
                    <>
                        <label htmlFor="filtro-auxiliar-especifico">Qual disponibilidade?</label>
                        <select
                            id="filtro-auxiliar-especifico"
                            name="filtro-auxiliar-especifico"
                            onChange={handleAuxiliarBuscaEspecifica}
                            value={auxiliarBuscaEspecifica}
                        >
                            <option value="">Selecione</option>
                            <option value="DISPONIVEL">Disponivel</option>
                            <option value="INDISPONIVEL">Indisponível</option>
                            <option value="DISP_C_RESTRICAO">Disponível com Restrição</option>
                            <option value="MANUTENCAO">Manutenção</option>
                        </select>
                    </>
                )}

                {/* Select 3 - nome dos módulos */}
                {buscaGeral === "MODULO" && buscaEspecifica === "NOME" && (
                    <>
                        <label htmlFor="filtro-auxiliar-especifico">Qual módulo?</label>
                        <select
                            id="filtro-auxiliar-especifico"
                            name="filtro-auxiliar-especifico"
                            onChange={handleAuxiliarBuscaEspecifica}
                            value={auxiliarBuscaEspecifica}
                        >
                            <option value="">Selecione</option>
                            {opcoesModulos.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* Select 3 - cabide */}
                {buscaGeral === "MODULO" && buscaEspecifica === "CABIDE" && (
                    <>
                        <label htmlFor="filtro-auxiliar-especifico">Qual cabide?</label>
                        <select
                            id="filtro-auxiliar-especifico"
                            name="filtro-auxiliar-especifico"
                            onChange={handleAuxiliarBuscaEspecifica}
                            value={auxiliarBuscaEspecifica}
                        >
                            <option value="">Selecione</option>
                            {cabides.map((cabide) => (
                                <option key={cabide.id} value={cabide.SN}>
                                    {cabide.SN}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* Select 3 - OM atual */}
                {buscaEspecifica === "ATUAL" && (
                    <>
                        <label htmlFor="filtro-auxiliar-especifico">Qual OM?</label>
                        <select
                            id="filtro-auxiliar-especifico"
                            name="filtro-auxiliar-especifico"
                            onChange={handleAuxiliarBuscaEspecifica}
                            value={auxiliarBuscaEspecifica}
                        >
                            <option value="">Selecione</option>
                            {batalhoes.map((batalhao) => (
                                <option key={batalhao.id} value={batalhao.sigla}>
                                    {batalhao.sigla}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <button type="submit" className="voltar-inicio-btn">
                    Voltar para o início
                </button>
            </form>
            <GraficoStatus itens={itens} />
        </section>
    );
}