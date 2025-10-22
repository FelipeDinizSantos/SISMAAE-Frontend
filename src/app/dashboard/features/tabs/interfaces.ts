import { Role } from "@/interfaces/Role.interface";

export interface TabConfig {
  key: "materiais" | "relatorios" | "controle-de-registros";
  label: string;
  allowed: Role[];
}