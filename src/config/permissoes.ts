import { Role } from "@/interfaces/Role.interface";

type PermissoesEntidade = {
    podeEditar: {
        [campo: string]: boolean;
    };
};

type PermissoesSistema = {
    modulos: Record<Role, PermissoesEntidade>;
    materiais: Record<Role, PermissoesEntidade>;
};

export const permissoes: PermissoesSistema = {
    modulos: {
        ADMIN: { podeEditar: {  } },
        COMANDO: { podeEditar: {  } },
        COL: { podeEditar: { status: true, obs: true, omAtual: true, cabideSN: true } },
        S4: { podeEditar: { status: true, obs: true, cabideSN: true } },
        MECANICO: { podeEditar: { status: true, obs: true } },
    },
    materiais: {
        ADMIN: { podeEditar: { } },
        COMANDO: { podeEditar: { } },
        COL: { podeEditar: { status: true, obs: true, omAtual: true  } },
        S4: { podeEditar: { status: true, obs: true, omAtual: false  } },
        MECANICO: { podeEditar: { status: true, obs: true, omAtual: false } },
    }
};
