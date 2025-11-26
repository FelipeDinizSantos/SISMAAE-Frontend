import { Perfil } from "@/interfaces/Perfil.interface";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function usePerfis() {
    const [perfis, setPerfis] = useState<Perfil[]>([]);

    useEffect(() => {
        const fetchPerfis = async () => {
            try {
                const res = await fetch(`/api/perfis`, {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Erro ao carregar perfis!");

                const data = await res.json();
                setPerfis(data.perfis || []);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    toast.error(err.message);
                } else {
                    toast.error("Ocorreu um erro inesperado!");
                }
            }
        };

        fetchPerfis();
    }, []);

    return {
        perfis,
    };
}
