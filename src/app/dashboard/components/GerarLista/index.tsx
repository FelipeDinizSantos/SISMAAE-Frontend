import { Dispatch, SetStateAction, useEffect } from "react";
import ListaMateriais from "../ListaMateriais";
import { Material } from "@/interfaces/Material.interface";
import { Modulo } from "@/interfaces/Modulo.interface";
import ListaModulos from "../ListaModulos";

export default function GerarLista({
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
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const metodoDeBusca = parametrosDeBusca.split('-')[1];

        if (parametrosDeBusca === "MATERIAL") {
            const fetchMateriais = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materiais/`, {
                        headers: { authorization: `Barear ${token}` }
                    });
                    const data = await res.json();

                    setMateriais(data.materiais || []);
                    setItens(data.materiais || []);
                } catch (error) {
                    console.error("Erro ao buscar materiais:", error);
                }
            };

            fetchMateriais();
        }

        if (parametrosDeBusca.split('-')[0] === "MODULO") {
            try {
                const fetchData = async () => {
                    if(!auxiliarBuscaEspecifica) return;

                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modulos?${metodoDeBusca.toLowerCase()}=${auxiliarBuscaEspecifica.toUpperCase()}`, {
                        headers: { authorization: `Barear ${token}` }
                    });

                    let data = await res.json();

                    console.log(data);

                    setItens(data.modulos);
                    setModulos(data.modulos);
                }

                fetchData();
            } catch (error) {
                console.error("Erro ao buscar modulos", error);
            }
        }

    }, [parametrosDeBusca, auxiliarBuscaEspecifica]);

    return (
        <>
            {
                parametrosDeBusca === "MATERIAL" && (
                    <ListaMateriais
                        materiais={materiais}
                        setMateriais={setMateriais}
                        setItens={setItens}
                    />
                )
            }

            {
                parametrosDeBusca.split('-')[0] === "MODULO" && (
                    <ListaModulos
                        modulos={modulos}
                        setItens={setItens}
                        setModulos={setModulos}
                    />
                )
            }
        </>
    )
}