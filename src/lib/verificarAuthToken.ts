import { getJwtSecret } from "@/config/middleware";
import { JWTPayload, jwtVerify } from "jose";

export async function verificarAuthToken(
  token: string
): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.warn("Falha ao verificar token:", error);
    return null;
  }
}
