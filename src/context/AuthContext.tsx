"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@/interfaces/Usuario.interface";
import { verificarAuthToken } from "@/lib/verificarAuthToken";
import { JWTPayload } from "jose";

type AuthContextType = {
  user: User | null;
  login: ({ email, senha }: { email: string; senha: string }) => Promise<JWTPayload>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const effectExecuted = useRef(false);

  useEffect(() => {
    if (!effectExecuted.current) {
      effectExecuted.current = true;
      fetchUser();
    }
  }, []);

  const fetchUser = async (skipLoading = false): Promise<User | null> => {
    if (!skipLoading) setLoading(true);

    try {
      const res = await fetch(`/api/usuarios/me`);

      if (res.status === 401) {
        setUser(null);
        return null;
      }

      const data = await res.json();
      const userFetched = data.resultado[0];

      setUser(userFetched);
      return userFetched;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      logout();
      return null;
    } finally {
      if (!skipLoading) setLoading(false);
    }
  };

  const login = async ({ email, senha }: { email: string; senha: string }): Promise<JWTPayload> => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idtMilitar: email, senha }),
    });

    const data: { success: boolean; token: string; error?: any } =
      await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao realizar login.");
    }

    const user = await verificarAuthToken(data.token);

    if (!user) {
      throw new Error("Erro ao carregar usuário");
    }

    return user;
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      console.error("Erro ao fazer logout", e);
    } finally {
      localStorage.removeItem("materialSelecionado");
      router.push("/");
      setUser(null);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
