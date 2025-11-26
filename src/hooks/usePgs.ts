import { PostosGrads } from "@/interfaces/PostosGrad.interface";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function usePgs() {
    const [postosGrads, setPostosGrads] = useState<PostosGrads[]>([]);

    useEffect(() => {
        const fetchPgs = async () => {
            try {
                const res = await fetch(`/api/postos_graduacoes`, {
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Erro ao carregar Postos e Graduacoes!");

                const data = await res.json();
                setPostosGrads(data.postosGraduacoes || []);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    toast.error(err.message);
                } else {
                    toast.error("Ocorreu um erro inesperado!");
                }
            }
        };

        fetchPgs();
    }, []);

    return {
        postosGrads,
    };
}
