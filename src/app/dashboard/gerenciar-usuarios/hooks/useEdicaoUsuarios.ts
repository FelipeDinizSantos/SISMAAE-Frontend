// useEdicaoUsuarios.ts
import { Batalhao } from "@/interfaces/Batalhao.interface";
import { Perfil } from "@/interfaces/Perfil.interface";
import { PostosGrads } from "@/interfaces/PostosGrad.interface";
import { User } from "@/interfaces/Usuario.interface";
import { useState } from "react";
import { toast } from "react-hot-toast";

type Usuario = any;

export function useEdicaoUsuarios(
    usuarios: Usuario[],
    setUsuarios: (u: User[]) => void,
    postosGrads: PostosGrads[],
    perfis: Perfil[],
    batalhoes: Batalhao[],
    user: User
) {
    const [usuariosEditaveis, setUsuariosEditaveis] = useState<Usuario[]>([]);

    const coercePerfilId = (u: any) => {
        if (u == null) return "";
        if (typeof u.perfil === "object") return String(u.perfil.id ?? "");
        return String(u.perfil ?? "");
    };

    const coerceBatalhaoId = (u: any) => {
        if (u == null) return "";
        // If batalhao is an object, use its id
        if (typeof u.batalhao === "object") return String(u.batalhao.id ?? "");
        // If batalhao is a sigla (string), try to find the id from batalhoes list
        if (typeof u.batalhao === "string") {
            const found = batalhoes.find((b) => b.sigla === u.batalhao || String(b.id) === u.batalhao);
            if (found) return String(found.id);
            return u.batalhao; // fallback (could be already an id string)
        }
        return String(u.batalhao ?? "");
    };

    const inicializar = (lista: Usuario[]) => {
        setUsuariosEditaveis(
            lista.map((u) => ({
                ...u,
                // guarantee perfil and batalhao are stored as id strings in the editable copy
                perfil: coercePerfilId(u),
                batalhao: coerceBatalhaoId(u),
                pg: u.pg ?? "",
                editando: false,
            }))
        );
    };

    const iniciarEdicao = (index: number) => {
        const novos = usuariosEditaveis.map((u, i) => {
            if (u.editando && i !== index) {
                return {
                    ...u,
                    editando: false,
                    nome: u.nome_original || u.nome,
                    idt_militar: u.idt_militar_original || u.idt_militar,
                    pg: u.pg_original || u.pg,
                    perfil: u.perfil_original || u.perfil,
                    batalhao: u.batalhao_original || u.batalhao,
                };
            }

            if (i === index) {
                return {
                    ...u,
                    editando: true,
                    nome_original: u.nome,
                    idt_militar_original: u.idt_militar,
                    pg_original: u.pg,
                    perfil_original: u.perfil,
                    batalhao_original: u.batalhao,
                };
            }

            return u;
        });

        setUsuariosEditaveis(novos);
    };

    const cancelarEdicao = (index: number) => {
        const novos = [...usuariosEditaveis];
        novos[index] = {
            ...novos[index],
            editando: false,
            nome: novos[index].nome_original || novos[index].nome,
            idt_militar: novos[index].idt_militar_original || novos[index].idt_militar,
            pg: novos[index].pg_original || novos[index].pg,
            perfil: novos[index].perfil_original || novos[index].perfil,
            batalhao: novos[index].batalhao_original || novos[index].batalhao,
        };
        setUsuariosEditaveis(novos);
    };

    const confirmarEdicao = async (id: number) => {
        const index = usuariosEditaveis.findIndex((u) => u.id === id);
        if (index === -1) return;

        const originalIndex = usuarios.findIndex((u) => u.id === id);
        if (originalIndex === -1) return;

        const novos = [...usuariosEditaveis];
        const usuarioEditado = { ...novos[index], editando: false };
        novos[index] = usuarioEditado;
        setUsuariosEditaveis(novos);

        const {
            editando,
            nome_original,
            idt_militar_original,
            pg_original,
            perfil_original,
            batalhao_original,
            ...usuarioSemPropsEditaveis
        } = usuarioEditado;

        setUsuarios(((prev: User[]) =>
            prev.map((u, i) =>
                i === originalIndex
                    ? {
                        ...u,
                        nome: usuarioSemPropsEditaveis.nome,
                        idt_militar: usuarioSemPropsEditaveis.idt_militar,
                        pg: usuarioSemPropsEditaveis.pg,
                        perfil_id: usuarioSemPropsEditaveis.perfil,
                        batalhao_id: usuarioSemPropsEditaveis.batalhao,
                    }
                    : u
            )
        ) as unknown as User[]);

        try {
            const perfilId = usuarioEditado.perfil ? Number(usuarioEditado.perfil) : null;
            const batalhaoId = usuarioEditado.batalhao ? Number(usuarioEditado.batalhao) : null;

            const body: any = {
                nome: usuarioEditado.nome,
                idt_militar: usuarioEditado.idt_militar,
                pg: usuarioEditado.pg,
                perfil_id: perfilId,
                batalhao_id: batalhaoId,
            };

            const res = await fetch(`/api/usuarios/${usuarios[originalIndex].id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err?.erro || "Erro inesperado");
            }

            await res.json();
            toast.success("Usuário atualizado");
        } catch (error: unknown) {
            cancelarEdicao(index);
            if (error instanceof Error) toast.error(error.message);
            else toast.error("Erro inesperado");
        }
    };

    const atualizarCampo = (index: number, campo: string, valor: any) => {
        const novos = [...usuariosEditaveis];
        if (campo === "perfil" || campo === "batalhao" || campo === "pg") {
            novos[index] = { ...novos[index], [campo]: valor };
        } else {
            novos[index] = { ...novos[index], [campo]: valor };
        }
        setUsuariosEditaveis(novos);
    };

    return {
        usuariosEditaveis,
        setUsuariosEditaveis,
        setUsuarios,
        usuarios,
        inicializar,
        iniciarEdicao,
        cancelarEdicao,
        confirmarEdicao,
        atualizarCampo,
    };
}