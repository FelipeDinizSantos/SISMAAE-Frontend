import { proxyFetch } from "@/lib/proxyFetch";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  return proxyFetch(req, `/registros/modulos/${id}`);
}
