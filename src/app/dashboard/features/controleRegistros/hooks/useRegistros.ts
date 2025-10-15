import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Registro } from "../../registros";

export default function useRegistros(token: string) {
    const [registros, setRegistros] = useState<Registro[]>([]);

    useEffect(() => {
        const fetchRegistros = async () => {
            console.log("pass!");

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/registros`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                })

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
        }

        fetchRegistros()
    }, [token]);

    return {
        registros
    }
}