"use client";

import { useState } from "react";
import "./CriarRegistro.css";

interface FormRegistroProps {
  materialId: number | null;
  moduloId: number | null;
  mecanicoId: number | null;
  onSuccess: () => void;
}

export default function CriarRegistro({ materialId, moduloId, mecanicoId, onSuccess }: FormRegistroProps) {
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
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/registros`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao criar registro");

      setAcao("");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Falha ao salvar registro.");
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
