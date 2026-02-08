import { User } from "@/interfaces/Usuario.interface";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function useUsuarios() {
    const [usuarios, setUsuarios] = useState<User[]>([]);

    const fetchUsuarios = async () => {
        try {
            const res = await fetch(`/api/usuarios`, {
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Erro ao carregar batalhões");

            setUsuarios(data.resultado || []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Ocorreu um erro inesperado!");
            }
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return {
        usuarios,
        reloadUsuarios: fetchUsuarios
    };
}
