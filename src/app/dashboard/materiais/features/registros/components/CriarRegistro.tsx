"use client";

import "../styles.css";

import { useState } from "react";
import toast from "react-hot-toast";
import { FormRegistroProps } from "../interfaces";

export default function CriarRegistro({
  materialId,
  moduloId,
  mecanicoId,
  onSuccess,
}: FormRegistroProps) {
  const [acao, setAcao] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      material_id: materialId,
      modulo_id: moduloId,
      acao,
      automatico: false,
      mecanico_id: mecanicoId,
    };

    try {
      const res = await fetch(`/api/registros`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao criar registro");

      setAcao("");

      toast.success("Registro criado");

      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Ocorreu um erro inesperado!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-registro">
      <label>
        Ação:
        <input
          type="text"
          placeholder="Ex.: Ajuste na antena"
          value={acao}
          onChange={(e) => setAcao(e.target.value)}
          required
        />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Criar Registro"}
      </button>
    </form>
  );
}
