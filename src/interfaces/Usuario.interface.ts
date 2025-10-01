export interface User {
  id: number;
  pg: string;
  nome: string;
  idt_militar: string;
  batalhao: string;
  perfil: "ADMIN" | "COMANDO" | "COL" | "S4" | "MECANICO";
};