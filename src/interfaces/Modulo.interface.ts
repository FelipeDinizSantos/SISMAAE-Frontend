export interface Modulo{
    id: number;
    modulo?: string;
    SN: string;
    SN_do_Cabide?: string; 
    Disponibilidade_do_Cabide: string;
    Disponibilidade: 'DISPONIVEL' | 'DISP_C_RESTRICAO' | 'INDISPONIVEL' | 'MANUTENCAO';
    Material: string;
    OM_Origem: string;
    OM_Atual: string;
    Obs: string;
    OM_Origem_Id?: number;
    OM_Atual_Id?: number;
}