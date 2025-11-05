import { useEffect, useState } from "react";
import { MaterialAPI } from "../app/dashboard/materiais/features/lista-modulos/interfaces";
import toast from "react-hot-toast";

export default function useCabides() {
  const [cabides, setcabides] = useState<MaterialAPI[]>([]);

  useEffect(() => {
    const fetchCabides = async () => {
      try {
        const res = await fetch(`/api/materiais/`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Erro ao carregar cabides");

        const data = await res.json();
        setcabides(data.materiais);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Ocorreu um erro inesperado!");
        }
      }
    };

    fetchCabides();
  }, []);

  return {
    cabides,
  };
}
