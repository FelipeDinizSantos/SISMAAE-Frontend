import { proxyFetch } from "@/lib/proxyFetch";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise <{ id: string }> }
) {
  const {id} = await context.params;
  return proxyFetch(req, `/registros/modulos/${id}`);
}
