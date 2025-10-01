import { useAuth } from "@/context/AuthContext";
import { User } from "@/interfaces/Usuario.interface";

export default async function criarRegistroAutomatico({ materialId = null, moduloId = null, acao, user }: {
    materialId: number | null;
    moduloId: number | null;
    acao: string;
    user: User | null
}) {
    const usuario = `[${user?.pg}. ${user?.nome} (${user?.perfil}) | ${user?.batalhao}]`;

    const payload = {
        material_id: materialId,
        modulo_id: moduloId,
        acao: acao + " - " + usuario,
        automatico: true,
    };

    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/registros`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Erro ao criar registro");
    } catch (err) {
        console.error(err);
        alert("Falha ao salvar registro.");
    }
};