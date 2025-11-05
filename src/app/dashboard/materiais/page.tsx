"use client";

import "./Materiais.css";

import { useEffect, useState } from "react";
import MenuLateral from "./components/MenuLateral";
import { Material } from "@/interfaces/Material.interface";
import { Modulo } from "@/interfaces/Modulo.interface";
import GerarLista from "./components/GerarTabelas";
import { SelecaoMateriais } from "./features/selecao-materiais";

export default function MateriaisPage() {
  // STATES DE CONTROLE DOS DADOS DAS TABELAS
  const [itens, setItens] = useState<Material[] | Modulo[]>([]);
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [contextoLista, setContextoLista] = useState<string>("MATERIAL");

  // STATES DE CONTROLE DAS BUSCAS DO MENU LATERAL
  const [buscaGeral, setBuscaGeral] = useState<"MODULO" | "MATERIAL" | "">(
    "MATERIAL"
  );
  const [buscaEspecifica, setBuscaEspecifica] = useState("");
  const [auxiliarBuscaEspecifica, setAuxiliarBuscaEspecifica] = useState("");

  const materialJaSelecionado = localStorage.getItem("materialSelecionado")
    ? localStorage.getItem("materialSelecionado")
    : "";
  const [materialSelecionado, setMaterialSelecionado] = useState<
    "radar" | "rbs" | "col" | ""
  >(materialJaSelecionado as "radar" | "rbs" | "col" | "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchMateriais = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/materiais/`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();

        setMateriais(data.materiais || []);
        setItens(data.materiais || []);
      } catch (error) {
        console.error("Erro ao buscar materiais:", error);
      }
    };

    fetchMateriais();
  }, []);

  return (
    <>
      <main className="dashboard-container">
        {!materialSelecionado ? (
          <SelecaoMateriais setMaterialSelecionado={setMaterialSelecionado} />
        ) : (
          <>
            <MenuLateral
              itens={itens}
              setContextoLista={setContextoLista}
              auxiliarBuscaEspecifica={auxiliarBuscaEspecifica}
              buscaEspecifica={buscaEspecifica}
              buscaGeral={buscaGeral}
              setAuxiliarBuscaEspecifica={setAuxiliarBuscaEspecifica}
              setBuscaEspecifica={setBuscaEspecifica}
              setBuscaGeral={setBuscaGeral}
            />
            <section className="conteudo">
              <GerarLista
                parametrosDeBusca={contextoLista}
                setItens={setItens}
                setContextoLista={setContextoLista}
                auxiliarBuscaEspecifica={auxiliarBuscaEspecifica}
                setModulos={setModulos}
                setMateriais={setMateriais}
                materiais={materiais}
                modulos={modulos}
              />
            </section>
          </>
        )}
      </main>
    </>
  );
}
