"use client";

import { useState } from "react";
import "./CadastroUsuario.css";
import toast from "react-hot-toast";
import { useBatalhao } from "@/hooks/useBatalhao";
import { usePerfis } from "@/hooks/usePerfis";
import { usePgs } from "@/hooks/usePgs";

export default function CadastroUsuario() {

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        nome: "",
        idtMil: "",
        senha: "",
        posto: "",
        batalhao: "",
        email: "",
        perfil: ""
    });

    const { batalhoes } = useBatalhao();
    const { perfis } = usePerfis();
    const { postosGrads } = usePgs();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            idtMilitar: formData.idtMil,
            senha: formData.senha,
            pg: formData.posto,
            email: formData.email,
            nome: formData.nome,
            batalhaoId: formData.batalhao,
            perfilId: formData.perfil
        }

        try {
            const res = await fetch(`/api/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Erro ao criar registro");

            toast.success("Usuário cadastrado");
            setFormData({
                nome: "",
                idtMil: "",
                senha: "",
                posto: "",
                batalhao: "",
                email: "",
                perfil: ""
            });

        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Ocorreu um erro inesperado!");
            }
        }
    };

    return (
        <section className="cadastro-usuario">
            <h2>Cadastro de Usuário</h2>

            <form onSubmit={handleSubmit}>

                <label>Nome</label>
                <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Digite o nome completo"
                />

                <label>Identidade Militar</label>
                <input
                    type="text"
                    name="idtMil"
                    value={formData.idtMil}
                    onChange={handleChange}
                    placeholder="Digite a identidade militar"
                />

                <label>Senha</label>
                <div className="password-input-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="senha"
                        value={formData.senha}
                        onChange={handleChange}
                        placeholder="Digite uma senha"
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                        {showPassword ? "🔓" : "🔒"}
                    </button>
                </div>

                <label>Posto/Graduação</label>
                <select name="posto" value={formData.posto} onChange={handleChange}>
                    <option value="">Selecione</option>
                    {postosGrads.map(p => (
                        <option key={p.sigla} value={p.sigla}>{p.nome}</option>
                    ))}
                </select>

                <label>Batalhão</label>
                <select name="batalhao" value={formData.batalhao} onChange={handleChange}>
                    <option value="">Selecione</option>
                    {batalhoes.map(b => (
                        <option key={b.id} value={b.id}>{b.sigla}</option>
                    ))}
                </select>

                <label>E-Mail</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Digite o e-mail do usuário"
                />

                <label>Perfil de Acesso</label>
                <select name="perfil" value={formData.perfil} onChange={handleChange}>
                    <option value="">Selecione</option>
                    {perfis.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                </select>

                <button type="submit" className="btn-cadastrar">
                    Cadastrar
                </button>

            </form>
        </section>
    );
}
