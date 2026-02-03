import { proxyFetch } from "@/lib/proxyFetch";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return proxyFetch(req, `/materiais`);
}

export async function POST(req: NextRequest) {
  return proxyFetch(req, `/materiais`);
}
