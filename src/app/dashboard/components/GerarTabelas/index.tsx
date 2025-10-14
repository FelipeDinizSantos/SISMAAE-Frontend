'use client';

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Material } from "@/interfaces/Material.interface";
import { Modulo } from "@/interfaces/Modulo.interface";
import toast from "react-hot-toast";
import { ListaMateriais } from "../../features/materiais";
import { ListaModulos } from "../../features/modulos";

export default function GerarTabelas({
    parametrosDeBusca,
    setItens,
    auxiliarBuscaEspecifica,
    modulos,
    setModulos,
    setMateriais,
    materiais
}: {
    parametrosDeBusca: string
    setItens: Dispatch<SetStateAction<Material[] | Modulo[]>>
    setContextoLista: Dispatch<SetStateAction<string>>
    auxiliarBuscaEspecifica: string
    modulos: Modulo[]
    setModulos: Dispatch<SetStateAction<Modulo[]>>
    setMateriais: Dispatch<SetStateAction<Material[]>>
    materiais: Material[]
}) {
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [metodoDeBusca, busca] = parametrosDeBusca.split('-');

        if (metodoDeBusca === "MATERIAL") {
            const fetchMateriais = async () => {
                try {
                    if (busca) {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materiais?${busca.toLowerCase()}=${auxiliarBuscaEspecifica.toUpperCase()}`, {
                            headers: { authorization: `Barear ${token}` }
                        });

                        const data = await res.json();
                        const materiais = data.materiais || [];

                        setMateriais(materiais);
                        setItens(materiais);
                    }
                    if (!busca) {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materiais/`, {
                            headers: { authorization: `Barear ${token}` }
                        });
                        const data = await res.json();
                        const materiais = data.materiais || [];

                        setMateriais(materiais);
                        setItens(materiais);
                    }
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        toast.error(error.message);
                    } else {
                        toast.error("Ocorreu um erro inesperado!");
                    }
                }
            };

            fetchMateriais();
            if (reload) setReload(false);
        }

        if (parametrosDeBusca.split('-')[0] === "MODULO") {
            try {
                const fetchData = async () => {
                    if (!auxiliarBuscaEspecifica) return;

                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modulos?${busca.toLowerCase()}=${auxiliarBuscaEspecifica.toUpperCase()}`, {
                        headers: { authorization: `Barear ${token}` }
                    });

                    let data = await res.json();

                    setItens(data.modulos);
                    setModulos(data.modulos);
                }

                fetchData();
                if (reload) setReload(false);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Ocorreu um erro inesperado!");
                }
            }
        }

    }, [parametrosDeBusca, auxiliarBuscaEspecifica, reload]);

    return (
        <>
            {
                parametrosDeBusca.split('-')[0] === "MATERIAL" && (
                    <ListaMateriais
                        materiais={materiais}
                        setMateriais={setMateriais}
                        setItens={setItens}
                        setReload={setReload}
                    />
                )
            }

            {
                parametrosDeBusca.split('-')[0] === "MODULO" && (
                    <ListaModulos
                        modulos={modulos}
                        setItens={setItens}
                        setModulos={setModulos}
                        setReload={setReload}
                    />
                )
            }
        </>
    )
}