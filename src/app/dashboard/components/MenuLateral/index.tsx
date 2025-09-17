import { Material } from "@/interfaces/Material.interface";
import GraficoStatus from "../GraficoStatus";
import "./MenuLateral.css";
import { Modulo } from "@/interfaces/Modulo.interface";
import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";

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
        buscaGeral: string;
        setBuscaGeral: Dispatch<SetStateAction<string>>
        buscaEspecifica: string;
        setBuscaEspecifica: Dispatch<SetStateAction<string>>
        auxiliarBuscaEspecifica: string;
        setAuxiliarBuscaEspecifica: Dispatch<SetStateAction<string>>
    }) {
    const [filtroGeralValue, setFiltroGeralValue] = useState('');

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
            default:
                setBuscaGeral("MATERIAL")
                setContextoLista("MATERIAL")
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
            default:
                setBuscaEspecifica('');
        }

        setAuxiliarBuscaEspecifica('');
    };

    const handleAuxiliarBuscaEspecifica = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAuxiliarBuscaEspecifica(event.target.value);

        if (buscaEspecifica === "NOME") setContextoLista("MODULO-NOME");
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setContextoLista('MATERIAL');
        setBuscaGeral('');
        setBuscaEspecifica('');
        setAuxiliarBuscaEspecifica('');
        setFiltroGeralValue(''); 
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
                    value={filtroGeralValue} // Controlar o valor
                >
                    <option value="">Selecione</option>
                    <option value="MODULO">Módulos</option>
                </select>

                {/* Select 2 */}
                {buscaGeral === "MODULO" && (
                    <>
                        <label htmlFor="filtro-especifico">Método da busca</label>
                        <select id="filtro-especifico" name="filtro-especifico" onChange={handleBuscaEspecifica}>
                            <option value="">Selecione</option>
                            <option value="NOME">Nome</option>
                        </select>
                    </>
                )}

                {/* Select 3 */}
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

                <button type="submit" className="voltar-inicio-btn">
                    Voltar para o início
                </button>
            </form>

            <GraficoStatus itens={itens} />
        </section>
    );
}