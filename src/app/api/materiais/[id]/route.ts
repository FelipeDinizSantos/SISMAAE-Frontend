import { proxyFetch } from "@/lib/proxyFetch";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  return proxyFetch(req, `/materiais/${id}`);
}
