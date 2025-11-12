export default function buildQuery({
  tipo,
  busca,
  auxiliar,
  materialSelecionado,
}: {
  tipo: "MATERIAL" | "MODULO";
  busca?: string;
  auxiliar?: string;
  materialSelecionado?: string;
}) {
  const params = new URLSearchParams();

  if (busca && auxiliar)
    params.append(busca.toLowerCase(), auxiliar.toUpperCase());
  if (materialSelecionado)
    params.append("materialSelecionado", materialSelecionado);

  return `/api/${
    tipo === "MATERIAL" ? "materiais" : "modulos"
  }?${params.toString()}`;
}
