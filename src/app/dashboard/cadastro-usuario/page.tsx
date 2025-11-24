"use client";

import { useState } from "react";
import "./CadastroUsuario.css";

export default function CadastroUsuario() {

    const [formData, setFormData] = useState({
        nome: "",
        senha: "",
        posto: "",
        batalhao: "",
        perfil: ""
    });

    const postos = [
        "Soldado", "Cabo", "3º Sargento", "2º Sargento", "1º Sargento",
        "Subtenente", "Aspirante", "2º Tenente", "1º Tenente", "Capitão",
        "Major", "Tenente Coronel", "Coronel"
    ];

    const batalhoes = ["1° BPM", "2° BPM", "3° BPM", "4° BPM", "5° BPM"];

    const perfis = ["ADMIN", "GESTOR", "OPERADOR", "VISUALIZADOR"];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Usuário cadastrado (mock)!");
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
