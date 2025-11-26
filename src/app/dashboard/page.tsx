'use client';

import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user } = useAuth();

  if (user && user.perfil === "ADMIN") {
    redirect("dashboard/cadastro-usuario");
  }

  redirect("dashboard/materiais");
}
