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
        const res = await fetch(`/api/registros`, {
            method: "POST",
            headers: {
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