import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useRoleGuard(
  allowedRoles: string[],
  userRole: "ADMIN" | "COMANDO" | "COL" | "S4" | "MECANICO" | undefined
) {
  const router = useRouter();

  useEffect(() => {
    if (userRole && !allowedRoles.includes(userRole)) {
      router.replace("/nao-autorizado");
    }
  }, [allowedRoles, userRole, router]);
}
