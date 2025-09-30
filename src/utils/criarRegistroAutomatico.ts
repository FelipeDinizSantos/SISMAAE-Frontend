export default async function criarRegistroAutomatico({ materialId = null, moduloId = null, acao }: {
    materialId: number | null;
    moduloId: number | null;
    acao: string;
}) {
    const payload = {
        material_id: materialId,
        modulo_id: moduloId,
        acao,
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