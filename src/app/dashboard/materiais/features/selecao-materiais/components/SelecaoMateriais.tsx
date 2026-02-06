"use client";

import "../styles.css";

import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

export default function SelecaoMateriais({
  setMaterialSelecionado,
}: {
  setMaterialSelecionado: Dispatch<
    SetStateAction<"" | "radar" | "rbs70" | "coaae" | "rbsSimulador">
  >;
}) {
  const opcoes = [
    {
      nome: "Radar",
      key: "radar",
      descricao:
        "Radares e módulos de vigilância aérea responsáveis pela detecção e rastreamento de alvos.",
    },
    {
      nome: "RBS",
      key: "rbs70",
      descricao:
        "Sistema portátil para lançamento de mísseis antiaéreos remotamente controlados.",
    },
    {
      nome: "COAAE",
      key: "coaae",
      descricao:
        "Centro de operações responsável pelo comando, controle e coordenação das ações de artilharia antiaérea.",
    },
    {
      nome: "Simulador RBS70",
      key: "rbsSimulador",
      descricao:
        "Sistema de treinamento utilizado para simular a operação do RBS 70.",
    },
  ];

  const handleSelect = (tipo: string) => {
    setMaterialSelecionado(tipo as "radar" | "rbs70" | "coaae" | "rbsSimulador");
    localStorage.setItem("materialSelecionado", tipo);
  };

  return (
    <main className="selecao-container">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Selecione o tipo de material
      </motion.h1>

      <section className="opcoes-container">
        {opcoes.map((opcao) => (
          <motion.div
            key={opcao.key}
            className="card-opcao"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(opcao.key)}
          >
            <h2>{opcao.nome}</h2>
            <p>{opcao.descricao}</p>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
