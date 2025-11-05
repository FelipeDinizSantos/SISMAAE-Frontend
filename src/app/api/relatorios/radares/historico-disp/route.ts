import { proxyFetch } from "@/lib/proxyFetch";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return proxyFetch(req, `/relatorios/radares/historico-disp`);
}
