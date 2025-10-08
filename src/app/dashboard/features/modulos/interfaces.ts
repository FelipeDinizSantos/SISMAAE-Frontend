import { Modulo } from "@/interfaces/Modulo.interface";

export interface ModuloEditado extends Modulo {
    editando?: boolean;
    disponibilidadeOriginal?: string;
    obsOriginal?: string;
    omOrigemId?: number;
    omDestinoId?: number;
    cabideSNOriginal?: string;
    cabideSNSelecionado?: string;
    semCabide?: string;
}

export interface MaterialAPI {
    id: number;
    Material: string;
    SN: string;
    Disponibilidade: string;
    OM_Origem: string;
    OM_Atual: string;
    Obs: string;
}