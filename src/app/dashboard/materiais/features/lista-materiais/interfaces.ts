import { Material } from "@/interfaces/Material.interface";

export interface MaterialEditado extends Material {
    editando?: boolean;
    disponibilidadeOriginal?: string;
    obsOriginal?: string;
    OM_Atual_Original?: string;
}