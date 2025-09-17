export interface Material {
    id: number;
    Material?: string;
    SN: string;
    Disponibilidade: 'DISPONIVEL' | 'DISP_C_RESTRICAO' | 'INDISPONIVEL' | 'MANUTENCAO';
    OM_Origem: string;
    OM_Atual: string;
    Obs: string;
}