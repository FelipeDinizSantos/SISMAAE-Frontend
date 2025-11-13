import { proxyFetch } from "@/lib/proxyFetch";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const {id} = await context.params;
  return proxyFetch(req, `/modulos/${id}`);
}
