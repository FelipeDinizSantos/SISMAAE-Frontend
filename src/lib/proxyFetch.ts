import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function proxyFetch(req: NextRequest, endpoint: string) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const queryString = req.nextUrl.search;
  const apiUrl = `${process.env.API_URL}${endpoint}${queryString}`;

  const body = req.method !== "GET" ? await req.text() : undefined;

  const res = await fetch(apiUrl, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": req.headers.get("content-type") ?? "application/json",
    },
    body,
  });

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}
