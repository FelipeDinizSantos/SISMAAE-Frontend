"use client";

import { useState } from "react";
import styles from "./styles.module.css";
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

    const senha = formData.senha;

    const senhaValida =
        senha.length >= 8 &&
        /[A-Za-z]/.test(senha) &&
        /[0-9]/.test(senha);

    const regrasSenha = {
        tamanho: senha.length >= 8,
        letra: /[A-Za-z]/.test(senha),
        numero: /[0-9]/.test(senha),
    };

    const idtMilValida = /^[0-9]{10}$/.test(formData.idtMil);

    const todosCamposPreenchidos =
        formData.nome &&
        formData.idtMil &&
        formData.senha &&
        formData.posto &&
        formData.batalhao &&
        formData.email &&
        formData.perfil;

    const podeEnviar = todosCamposPreenchidos && senhaValida && idtMilValida;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "idtMil") {
            if (!/^\d*$/.test(value)) return;
            if (value.length > 10) return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!podeEnviar) {
            if (!idtMilValida) toast.error("A identidade militar deve conter exatamente 10 dígitos.");
            if (!senhaValida) toast.error("A senha não atende aos requisitos mínimos.");
            return;
        }

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
                headers: { "Content-Type": "application/json" },
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
            if (err instanceof Error) toast.error(err.message);
            else toast.error("Ocorreu um erro inesperado!");
        }
    };

    return (
        <section className={styles.container}>
            <h2 className={styles.titulo}>Cadastro de Usuário</h2>

            <form onSubmit={handleSubmit} className={styles.form}>

                <div className={`${styles.formField} ${styles.fullWidth}`}>
                    <label className={styles.label}>Nome</label>
                    <div className={styles.wrapper}>
                        <input
                            className={styles.input}
                            type="text"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Digite o nome de guerra"
                        />
                    </div>
                </div>

                <div className={`${styles.formField} ${styles.fullWidth}`}>
                    <label className={styles.label}>E-mail</label>
                    <div className={styles.wrapper}>
                        <input
                            className={styles.input}
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Digite o e-mail do usuário"
                        />
                    </div>
                </div>

                <div className={`${styles.formField} ${styles.fullWidth}`}>
                    <label className={styles.label}>Identidade Militar</label>
                    <div className={styles.wrapper}>
                        <input
                            className={styles.input}
                            type="text"
                            name="idtMil"
                            value={formData.idtMil}
                            onChange={handleChange}
                            placeholder="Apenas números (10 dígitos)"
                            maxLength={10}
                        />
                    </div>
                </div>

                <div className={`${styles.formField} ${styles.fullWidth}`}>
                    <label className={styles.label}>Senha</label>

                    <div className={styles.wrapper}>
                        <input
                            className={`${styles.input} ${styles.passwordInput}`}
                            type={showPassword ? "text" : "password"}
                            name="senha"
                            value={formData.senha}
                            onChange={handleChange}
                            placeholder="Digite uma senha"
                        />

                        <button
                            type="button"
                            className={styles.togglePassword}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🔓" : "🔒"}
                        </button>
                    </div>

                    {senha.length > 0 && (
                        <div className={styles.passwordRules}>
                            <div className={`${styles.passwordRule} ${regrasSenha.tamanho ? styles.valid : styles.invalid}`}>
                                <span className={styles.check}>{regrasSenha.tamanho ? "✔" : "✖"}</span>
                                Mínimo de 8 caracteres
                            </div>

                            <div className={`${styles.passwordRule} ${regrasSenha.letra ? styles.valid : styles.invalid}`}>
                                <span className={styles.check}>{regrasSenha.letra ? "✔" : "✖"}</span>
                                Deve conter ao menos 1 letra
                            </div>

                            <div className={`${styles.passwordRule} ${regrasSenha.numero ? styles.valid : styles.invalid}`}>
                                <span className={styles.check}>{regrasSenha.numero ? "✔" : "✖"}</span>
                                Deve conter ao menos 1 número
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>Posto/Graduação</label>
                    <select
                        className={styles.select}
                        name="posto"
                        value={formData.posto}
                        onChange={handleChange}
                    >
                        <option value="">Selecione</option>
                        {postosGrads.map(p => (
                            <option key={p.sigla} value={p.sigla}>{p.nome}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>Batalhão</label>
                    <select
                        className={styles.select}
                        name="batalhao"
                        value={formData.batalhao}
                        onChange={handleChange}
                    >
                        <option value="">Selecione</option>
                        {batalhoes.map(b => (
                            <option key={b.id} value={b.id}>{b.sigla}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>Perfil de Acesso</label>
                    <select
                        className={styles.select}
                        name="perfil"
                        value={formData.perfil}
                        onChange={handleChange}
                    >
                        <option value="">Selecione</option>
                        {perfis.map(p => (
                            <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                    </select>
                </div>

                <div className={`${styles.formField} ${styles.fullWidth}`}>
                    <button
                        type="submit"
                        className={styles.botao}
                        disabled={!podeEnviar}
                    >
                        Cadastrar
                    </button>
                </div>

            </form>
        </section>
    );
}
