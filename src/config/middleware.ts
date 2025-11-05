// Prática de manipulação do segredo talvez traga brechas de segurança em produção. Em longo prazo, validar abordagem.
export const JWT_SECRET = "Rz3Q9y!vFj4pTz$1mKd%Wb7Lx^8Ns@eCqGz&PdXvYr!9BtLuC~";

// Rotas que exigem autenticação. Cada novo agrupamento de rotas deve ser adicionado como gatilho no matcher do middleware.
export const PROTECTED_ROUTES = [
  "/dashboard",
  "/dashboard/controle-de-registros",
  "/dashboard/materiais",
  "/dashboard/relatorios",
];

export const getJwtSecret = (): Uint8Array => {
  const secret = JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET não configurado. Adicione-o ao seu .env.local para segurança."
    );
  }
  return new TextEncoder().encode(secret);
};

export const acessoRotas: Record<string, string[]> = {
  "/dashboard/controle-de-registros": ["ADMIN", "COMANDO", "COL"],
};
