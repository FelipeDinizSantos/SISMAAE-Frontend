"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User } from "@/interfaces/Usuario.interface";

type AuthContextType = {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
    setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/usuarios/me`);

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json();

      setUser(data.resultado[0]);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    await fetchUser();
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

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
