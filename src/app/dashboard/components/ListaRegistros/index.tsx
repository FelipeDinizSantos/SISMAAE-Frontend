"use client";
import { useEffect, useState } from "react";

import "./ListaRegistros.css";

interface Registro {
  id: number;
  acao: string;
  automatico: boolean;
  mecanico_id: number;
  mecanico_nome: string;
  mecanico_posto: string;
  data: string;
}

interface ListaRegistrosProps {
  materialId: number;
}

export default function ListaRegistros({ materialId }: ListaRegistrosProps) {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/registros/materiais/${materialId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setRegistros(data.Registros);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistros();
  }, [materialId]);

  if (loading) return <p>Carregando registros...</p>;

  if (registros.length === 0) return <p>Nenhum registro encontrado.</p>;

  return (
    <ul className="lista-registros">
      {registros.map((r) => (
        <li key={r.id}>
          <strong>Ação:</strong> {r.acao} <br />
          <strong>Mecânico:</strong> {r.mecanico_posto + '. ' + r.mecanico_nome} | Automático: {r.automatico ? "Sim" : "Não"} <br />
          <small>{new Date(r.data).toLocaleDateString()} </small>
        </li>
      ))}
    </ul>
  );
}
