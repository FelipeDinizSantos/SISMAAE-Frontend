import { Material } from "@/interfaces/Material.interface";
import GraficoStatus from "../GraficoStatus";
import "./MenuLateral.css";
import { Modulo } from "@/interfaces/Modulo.interface";
import { Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from "react";
import { Batalhao } from "@/interfaces/Batalhao.interface";

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
    const [listaBatalhoes, setlistaBatalhoes] = useState<Batalhao[]>([]);
    const [listaCabide, setlistaCabide] = useState<Material[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        try {
            let fetchData = async () => {
                let resBatalhoes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/batalhoes`, {
                    headers: { authorization: `Barear ${token}` }
                });

                let dataBatalhoes = await resBatalhoes.json();

                setlistaBatalhoes(dataBatalhoes.batalhoes);
            
            let resCabide = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materiais`, {
                    headers: { authorization: `Barear ${token}` }
                });

                let dataCabide = await resCabide.json();
                
                setlistaCabide(dataCabide.resultado);
            }

            fetchData();
        } catch (error) {
            console.error("Erro ao buscar modulos:", error);
        }
    }, []);

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
            case "CABIDE":
                setBuscaEspecifica("CABIDE");
                break;
            case "OM_ATUAL":
                setBuscaEspecifica("OM_ATUAL");
                break;
            default:
                setBuscaEspecifica('');
        }

        setAuxiliarBuscaEspecifica('');
    };

    const handleAuxiliarBuscaEspecifica = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAuxiliarBuscaEspecifica(event.target.value);

        if (buscaEspecifica === "NOME") setContextoLista("MODULO-NOME");
        if (buscaEspecifica === "CABIDE") setContextoLista("MODULO-CABIDE");
        if (buscaEspecifica === "OM_ATUAL") setContextoLista("MODULO-OM_ATUAL");
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
                            <option value="CABIDE">Cabide</option>
                            <option value="OM_ATUAL">OM Atual</option>
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
                            {listaCabide.map((cabide) => (
                                <option key={cabide.id} value={cabide.SN}>
                                    {cabide.SN}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                {/* Select 3 - OM atual */}
                {buscaGeral === "MODULO" && buscaEspecifica === "OM_ATUAL" && (
                    <>
                        <label htmlFor="filtro-auxiliar-especifico">Qual OM?</label>
                        <select
                            id="filtro-auxiliar-especifico"
                            name="filtro-auxiliar-especifico"
                            onChange={handleAuxiliarBuscaEspecifica}
                            value={auxiliarBuscaEspecifica}
                        >
                            <option value="">Selecione</option>
                            {listaBatalhoes.map((batalhao) => (
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