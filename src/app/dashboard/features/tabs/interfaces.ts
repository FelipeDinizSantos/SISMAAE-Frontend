import { Role } from "@/interfaces/Role.interface";

export interface TabConfig {
  key: "materiais" | "relatorios" | "controle-de-registros" | "cadastro-usuario" | "gerenciar-usuarios";
  label: string;
  allowed: Role[];
}