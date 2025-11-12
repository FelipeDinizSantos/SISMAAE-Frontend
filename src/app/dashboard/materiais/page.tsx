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
    "radar" | "rbs70" | "col" | ""
  >(materialJaSelecionado as "radar" | "rbs70" | "col" | "");

  return (
    <>
      <main className="dashboard-container">
        {!materialSelecionado ? (
          <SelecaoMateriais setMaterialSelecionado={setMaterialSelecionado} />
        ) : (
          <>
            <MenuLateral
              parametrosDeBusca={contextoLista}
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
