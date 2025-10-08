import { Batalhao } from "@/interfaces/Batalhao.interface";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useBatalhao(token: string) {
    const [batalhoes, setBatalhoes] = useState<Batalhao[]>([]);

    useEffect(() => {
        if (!token) {
            return;
        }

        const fetchBatalhoes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/batalhoes`, {
                    headers: { 'Authorization': `Barear ${token}` }
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
        }

        fetchBatalhoes();
    }, [token]);

    return {
        batalhoes,
    }
}