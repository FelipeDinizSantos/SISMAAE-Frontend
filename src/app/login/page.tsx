"use client";

import "./Login.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idtMilitar: email, senha }),
      });

      const data: { success: boolean; token: string; error?: any } =
        await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao realizar login.");
        setLoading(false);
        return;
      }

      login(data.token);
      router.push("/dashboard/materiais");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="inner">
          <div className="card">
            <div className="card-content">
              <h1 className="form-title">Entre com seus dados</h1>
              <form className="form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Identidade Militar</label>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Ex: 1234567890"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group password-group">
                  <label htmlFor="password">Senha</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      required
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Esconder senha" : "Mostrar senha"
                      }
                    >
                      {showPassword ? "🔓" : "🔒"}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </button>

                <p className="register-text">
                  Sem acesso? <a href="#">Entre em contato com nossa equipe</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
