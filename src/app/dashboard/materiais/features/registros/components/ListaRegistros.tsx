"use client";

import "../styles.css";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ListaRegistrosProps, Registro } from "../interfaces";

export default function ListaRegistros({
  itemId,
  isMaterial,
}: ListaRegistrosProps) {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const res = await fetch(
          `/api/registros/${isMaterial ? "materiais" : "modulos"}/${itemId}`
        );

        const data = await res.json();
        setRegistros(data.registros);
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

    fetchRegistros();
  }, [itemId]);

  if (loading) return <p>Carregando registros...</p>;

  if (registros.length === 0) return <p>Nenhum registro encontrado.</p>;

  return (
    <ul className="lista-registros">
      {registros.map((r) => (
        <li key={r.id}>
          <div className="registros-infos">
            <div className="codigo">{r.cod}</div>
            <div
              className={`registro-badge ${
                r.automatico ? "automatico" : "manual"
              }`}
            >
              {r.automatico ? "Automático" : "Manual"}
            </div>
          </div>
          <p className="acao">
            <strong>Ação:</strong> {r.acao}
          </p>
          {r.mecanico_id && (
            <p>
              <strong>Criado por:</strong>{" "}
              {`${r.mecanico_posto}. ${r.mecanico_nome} - ${r.mecanico_batalhao} (${r.perfil})`}
            </p>
          )}
          <small>
            <p className="data-criacao-registro">
              <em>
                {new Date(r.data).toLocaleDateString()} às{" "}
                {new Date(r.data).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </em>
            </p>
          </small>
        </li>
      ))}
    </ul>
  );
}
