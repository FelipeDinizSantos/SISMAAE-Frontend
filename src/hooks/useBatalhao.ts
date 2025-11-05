import { Batalhao } from "@/interfaces/Batalhao.interface";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useBatalhao() {
  const [batalhoes, setBatalhoes] = useState<Batalhao[]>([]);

  useEffect(() => {
    const fetchBatalhoes = async () => {
      try {
        const res = await fetch(`/api/batalhoes`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erro ao carregar batalhões");

        const data = await res.json();
        setBatalhoes(data.batalhoes || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Ocorreu um erro inesperado!");
        }
      }
    };

    fetchBatalhoes();
  }, []);

  return {
    batalhoes,
  };
}
