import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ListaMateriais from "../ListaMateriais";
import { Material } from "@/interfaces/Material.interface";
import { Modulo } from "@/interfaces/Modulo.interface";
import ListaModulos from "../ListaModulos";
import toast from "react-hot-toast";

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

                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modulos?${metodoDeBusca.toLowerCase()}=${auxiliarBuscaEspecifica.toUpperCase()}`, {
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
                parametrosDeBusca === "MATERIAL" && (
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