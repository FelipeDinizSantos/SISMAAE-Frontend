"use client";

import { useState } from "react";
import "./CadastroUsuario.css";
import toast from "react-hot-toast";

export default function CadastroUsuario() {

    const [formData, setFormData] = useState({
        nome: "",
        idtMil: "",
        senha: "",
        posto: "",
        batalhao: "",
        email: "",
        perfil: ""
    });

    const postos = [
        "SD",
    ];

    const batalhoes = [
        "1",
    ];

    const perfis = [
        "1", "2", "3",
    ];

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

            if (!res.ok) throw new Error("Erro ao criar registro");
            console.log(res);

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
                <input
                    type="password"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    placeholder="Digite uma senha"
                />

                <label>Posto/Graduação</label>
                <select name="posto" value={formData.posto} onChange={handleChange}>
                    <option value="">Selecione</option>
                    {postos.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>

                <label>Batalhão</label>
                <select name="batalhao" value={formData.batalhao} onChange={handleChange}>
                    <option value="">Selecione</option>
                    {batalhoes.map(b => (
                        <option key={b} value={b}>{b}</option>
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
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>

                <button type="submit" className="btn-cadastrar">
                    Cadastrar
                </button>

            </form>
        </section>
    );
}
