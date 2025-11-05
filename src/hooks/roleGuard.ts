import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useRoleGuard(allowedRoles: string[], userRole: string) {
  const router = useRouter();

  useEffect(() => {
    if (!allowedRoles.includes(userRole)) {
      router.replace("/nao-autorizado");
    }
  }, [allowedRoles, userRole, router]);
}
