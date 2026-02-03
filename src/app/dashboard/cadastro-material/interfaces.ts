export type Disponibilidade =
    | "DISPONIVEL"
    | "DISP_C_RESTRICAO"
    | "INDISPONIVEL"
    | "MANUTENCAO";

export type Material = {
    id: number;
    serial: string;
    tipo: string;
    disponibilidade: Disponibilidade;
    omOrigem: number;
    omAtual: number;
    modulos: Modulo[];
};

export type Modulo = {
    id: number;
    serial: string;
    tipo: string;
    disponibilidade: Disponibilidade;
    omOrigem: number;
    omAtual: number;
};
