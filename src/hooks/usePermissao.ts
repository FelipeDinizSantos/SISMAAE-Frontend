import { useMemo } from "react";
import { permissoes } from "@/config/permissoes";
import { Role } from "@/interfaces/Role.interface";
import { useAuth } from "@/context/AuthContext";

type PermissoesConfig = typeof permissoes;
export type Entidade = keyof PermissoesConfig;

export type CampoDaEntidade<E extends Entidade> =
    keyof PermissoesConfig[E][Role]["podeEditar"];

export function usePermissao(roleArg?: string) {
    const { user } = useAuth?.() ?? {};
    const role = (roleArg ?? (user && (user.perfil as string))) as Role | undefined;

    const podeEditar = useMemo(() => {
        return (entidade: Entidade, campo: string): boolean => {
            if (!role) return false;
            const ent = permissoes[entidade];
            if (!ent) return false;
            const rolePerm = ent[role as Role];
            if (!rolePerm) return false;
            return Boolean((rolePerm.podeEditar as Record<string, boolean>)[campo]);
        };
    }, [role]);

    return { podeEditar };
}