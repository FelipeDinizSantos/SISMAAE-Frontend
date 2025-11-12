"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { Material } from "@/interfaces/Material.interface";
import { Modulo } from "@/interfaces/Modulo.interface";
import toast from "react-hot-toast";
import { ListaMateriais } from "../../features/lista-materiais";
import { ListaModulos } from "../../features/lista-modulos";
import buildQuery from "@/lib/buildQuery";

export default function GerarTabelas({
  parametrosDeBusca,
  setItens,
  auxiliarBuscaEspecifica,
  modulos,
  setModulos,
  setMateriais,
  materiais,
}: {
  parametrosDeBusca: string;
  setItens: Dispatch<SetStateAction<Material[] | Modulo[]>>;
  setContextoLista: Dispatch<SetStateAction<string>>;
  auxiliarBuscaEspecifica: string;
  modulos: Modulo[];
  setModulos: Dispatch<SetStateAction<Modulo[]>>;
  setMateriais: Dispatch<SetStateAction<Material[]>>;
  materiais: Material[];
}) {
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const [metodoDeBusca, busca] = parametrosDeBusca.split("-");
    const tipo = metodoDeBusca as "MATERIAL" | "MODULO";

    const fetchData = async () => {
      try {
        const url = buildQuery({
          tipo,
          busca,
          auxiliar: auxiliarBuscaEspecifica,
          materialSelecionado: localStorage.getItem("materialSelecionado")!,
        });

        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();

        if (tipo === "MATERIAL") {
          setMateriais(data.materiais || []);
          setItens(data.materiais || []);
        } else {
          setModulos(data.modulos || []);
          setItens(data.modulos || []);
        }
      } catch (error: any) {
        toast.error(error.message || "Erro ao carregar dados");
      } finally {
        setReload(false);
        setLoading(false);
      }
    };

    fetchData();
  }, [parametrosDeBusca, auxiliarBuscaEspecifica, reload]);

  if (loading) {
    return <p>Montando a Tabela...</p>;
  }

  return (
    <>
      {parametrosDeBusca.split("-")[0] === "MATERIAL" && (
        <ListaMateriais
          materiais={materiais}
          setMateriais={setMateriais}
          setItens={setItens}
          setReload={setReload}
        />
      )}

      {parametrosDeBusca.split("-")[0] === "MODULO" && (
        <ListaModulos
          modulos={modulos}
          setItens={setItens}
          setModulos={setModulos}
          setReload={setReload}
        />
      )}
    </>
  );
}
