"use client";

import { useEffect, useState, useMemo } from "react";
import { usePaginacao } from "@/hooks/usePaginacao";
import { useAuth } from "@/context/AuthContext";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { useUsuarios } from "./hooks/useUsuarios";
import { useBatalhao } from "@/hooks/useBatalhao";
import { usePerfis } from "@/hooks/usePerfis";
import { usePgs } from "@/hooks/usePgs";
import capitalizar from "@/utils/capitalizar";
import styles from "./styles.module.css";
import { useEdicaoUsuarios } from "./hooks/useEdicaoUsuarios";

export default function GerenciarUsuariosPage() {
    const { user } = useAuth();
    useRoleGuard(["ADMIN", "COMANDO", "COL"], user?.perfil);

    const [buscaNome, setBuscaNome] = useState("");
    const [buscaIdt, setBuscaIdt] = useState("");
    const [pgFiltro, setPgFiltro] = useState("");
    const [perfilFiltro, setPerfilFiltro] = useState("");
    const [batalhaoFiltro, setBatalhaoFiltro] = useState("");

    const { usuarios: usuariosFromHook } = useUsuarios();
    const { batalhoes } = useBatalhao();
    const { perfis } = usePerfis();
    const { postosGrads } = usePgs();

    const [usuarios, setUsuarios] = useState<any[]>([]);
    useEffect(() => setUsuarios(usuariosFromHook.map((u: any) => ({ ...u }))), [usuariosFromHook]);

    const {
        usuariosEditaveis,
        setUsuariosEditaveis,
        inicializar,
        iniciarEdicao,
        cancelarEdicao,
        confirmarEdicao,
        atualizarCampo,
    } = useEdicaoUsuarios(usuarios, setUsuarios, postosGrads, perfis, batalhoes, user!!);

    useEffect(() => {
        inicializar(usuarios);
    }, [usuarios]);

    const usuariosFiltrados = useMemo(() => {
        return usuariosEditaveis.filter((u) => {
            const matchNome = u.nome.toLowerCase().includes(buscaNome.toLowerCase());
            const matchIdt = u.idt_militar.toLowerCase().includes(buscaIdt.toLowerCase());
            const matchPg = pgFiltro ? u.pg === pgFiltro : true;
            const matchPerfil = perfilFiltro ? u.perfil === perfilFiltro : true;
            const matchBatalhao = batalhaoFiltro ? u.batalhao == batalhaoFiltro : true;

            return matchNome && matchIdt && matchPg && matchPerfil && matchBatalhao;
        });
    }, [buscaNome, buscaIdt, pgFiltro, perfilFiltro, batalhaoFiltro, usuariosEditaveis]);

    const itensPorPagina = 20;
    const { itensPaginados, paginaAtual, setPaginaAtual, totalPaginas } = usePaginacao(itensPorPagina, usuariosFiltrados);

    return (
        <div className={styles["usuarios-container"]}>
            <div className={styles["usuarios-filtros"]}>
                <h3 className={styles["titulo-usuarios"]}>Filtros de busca</h3>

                <div className={styles["filtro-bloco-usuarios"]}>
                    <label htmlFor="nome">Nome:</label>
                    <input
                        id="nome"
                        type="text"
                        placeholder="Buscar por nome..."
                        value={buscaNome}
                        onChange={(e) => setBuscaNome(e.target.value)}
                        className={styles["filtro-input-usuarios"]}
                    />
                </div>

                <div className={styles["filtro-bloco-usuarios"]}>
                    <label htmlFor="idt">Identidade Militar:</label>
                    <input
                        id="idt"
                        type="text"
                        placeholder="Buscar por identidade..."
                        value={buscaIdt}
                        onChange={(e) => setBuscaIdt(e.target.value)}
                        className={styles["filtro-input-usuarios"]}
                    />
                </div>

                <div className={styles["filtro-bloco-usuarios"]}>
                    <label>Posto/Graduação:</label>
                    <select value={pgFiltro} onChange={(e) => setPgFiltro(e.target.value)} className={styles["filtro-input-usuarios"]}>
                        <option value="">Todos</option>
                        {postosGrads.map((pg) => (
                            <option key={pg.nome} value={pg.sigla}>
                                {capitalizar(pg.nome)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles["filtro-bloco-usuarios"]}>
                    <label>Perfil:</label>
                    <select value={perfilFiltro} onChange={(e) => setPerfilFiltro(e.target.value)} className={styles["filtro-input-usuarios"]}>
                        <option value="">Todos</option>
                        {perfis.map((perfil) => (
                            <option key={perfil.id} value={perfil.nome}>
                                {capitalizar(perfil.nome)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles["filtro-bloco-usuarios"]}>
                    <label>Batalhão:</label>
                    <select value={batalhaoFiltro} onChange={(e) => setBatalhaoFiltro(e.target.value)} className={styles["filtro-input-usuarios"]}>
                        <option value="">Todos</option>
                        {batalhoes.map((batalhao) => (
                            <option key={batalhao.id} value={batalhao.sigla}>
                                {capitalizar(batalhao.sigla)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles["resumo-filtros-usuarios"]}>
                    <p>
                        <strong>{usuariosFiltrados.length}</strong> usuário(s) encontrado(s)
                    </p>
                    <button
                        className={styles["btn-limpar-filtros-usuarios"]}
                        onClick={() => {
                            setBuscaNome("");
                            setBuscaIdt("");
                            setPgFiltro("");
                            setPerfilFiltro("");
                            setBatalhaoFiltro("");
                        }}
                    >
                        Limpar filtros
                    </button>
                </div>
            </div>

            <div className={styles["usuarios-conteudo"]}>
                <h2 className={styles["titulo-usuarios"]}>Gerenciamento de Usuários</h2>

                {usuariosFiltrados.length === 0 ? (
                    <p>Nenhum usuário encontrado.</p>
                ) : (
                    <>
                        <div className={styles["tabela-usuarios"]}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Posto/Graduação</th>
                                        <th>Nome</th>
                                        <th>Identidade Militar</th>
                                        <th>Batalhão</th>
                                        <th>Perfil</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itensPaginados.map((u: any, idx: number) => (
                                        <tr key={u.id}>
                                            <td>
                                                {u.editando ? (
                                                    <select value={u.pg} onChange={(e) => atualizarCampo(idx + paginaAtual * 20, "pg", e.target.value)} className={styles["filtro-input-usuarios"]}>
                                                        <option value="">Selecione</option>
                                                        {postosGrads.map((pg) => (
                                                            <option key={pg.sigla} value={pg.sigla}>{capitalizar(pg.nome)}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    u.pg
                                                )}
                                            </td>

                                            <td>
                                                {u.editando ? (
                                                    <input value={u.nome} onChange={(e) => atualizarCampo(idx + paginaAtual * 20, "nome", e.target.value)} className={styles["filtro-input-usuarios"]} />
                                                ) : (
                                                    capitalizar(u.nome)
                                                )}
                                            </td>

                                            <td>
                                                {u.editando ? (
                                                    <input value={u.idt_militar} onChange={(e) => atualizarCampo(idx + paginaAtual * 20, "idt_militar", e.target.value)} className={styles["filtro-input-usuarios"]} />
                                                ) : (
                                                    u.idt_militar
                                                )}
                                            </td>

                                            <td>
                                                {u.editando ? (
                                                    <select value={u.batalhao} onChange={(e) => atualizarCampo(idx + paginaAtual * 20, "batalhao", e.target.value)} className={styles["filtro-input-usuarios"]}>
                                                        <option value="">Selecione</option>
                                                        {batalhoes.map((b) => (
                                                            <option key={b.id} value={b.sigla}>{capitalizar(b.sigla)}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    u.batalhao
                                                )}
                                            </td>

                                            <td>
                                                {u.editando ? (
                                                    <select value={u.perfil} onChange={(e) => atualizarCampo(idx + paginaAtual * 20, "perfil", e.target.value)} className={styles["filtro-input-usuarios"]}>
                                                        <option value="">Selecione</option>
                                                        {perfis.map((p: any) => (
                                                            <option key={p.id} value={p.nome}>{capitalizar(p.nome)}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    u.perfil
                                                )}
                                            </td>

                                            <td>
                                                {u.editando ? (
                                                    <div className={styles["botoes-edicao"]}>
                                                        <button className={styles["btn-confirmar"]} onClick={() => confirmarEdicao(u.id)}>✓</button>
                                                        <button className={styles["btn-cancelar"]} onClick={() => cancelarEdicao(idx + paginaAtual * 20)}>✕</button>
                                                    </div>
                                                ) : (
                                                    <div className={styles["acoes-container"]}>
                                                        <button className={styles["btn-acao"]} onClick={() => iniciarEdicao(idx + paginaAtual * 20)}>Editar</button>
                                                        <button className={`${styles["btn-acao"]} ${styles["btn-danger"]}`}>Excluir</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles["tabs-container-usuarios"]}>
                            {Array.from({ length: totalPaginas }).map((_, idx) => (
                                <button key={idx} onClick={() => setPaginaAtual(idx)} className={`${styles["tab-button-usuarios"]} ${idx === paginaAtual ? styles["active"] : ""}`}>
                                    {idx + 1}
                                </button>
                            ))}
                        </div>

                        <div className={styles["info-paginacao-usuarios"]}>
                            Mostrando {itensPaginados.length} de {usuariosFiltrados.length} usuários
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
