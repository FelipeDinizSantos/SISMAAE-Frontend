export interface JWTPayload {
  id: number;
  pg: string;
  nome: string;
  role: "ADMIN" | "COMANDO" | "COL" | "S4" | "MECANICO";
  idtMilitar: string;
  perfilId: number;
  batalhaoId: number;
}
