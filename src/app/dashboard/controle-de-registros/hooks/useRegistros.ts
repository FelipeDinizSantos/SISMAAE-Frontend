import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Registro } from "../../materiais/features/registros";

export default function useRegistros() {
  const [registros, setRegistros] = useState<Registro[]>([]);

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const res = await fetch(`/api/registros`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const erro = await res.json();
          throw new Error(erro.erro || "Erro inesperado.");
        }

        const data = await res.json();
        setRegistros(data.registros);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Ocorreu um erro inesperado!");
        }
      }
    };

    fetchRegistros();
  }, []);

  return {
    registros,
  };
}
