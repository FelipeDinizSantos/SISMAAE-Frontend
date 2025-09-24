'use client';

import "./Dashboard.css";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import MenuLateral from "./components/MenuLateral";
import { Material } from "@/interfaces/Material.interface";
import { Modulo } from "@/interfaces/Modulo.interface";
import GerarLista from "./components/GerarLista";
import Relatorios from "./components/Relatorios";

export default function DashboardPage() {
    const router = useRouter();

    const { user, isAuthenticated, logout } = useAuth();

    // STATES DE CONTROLE DOS DADOS DAS TABELAS
    const [itens, setItens] = useState<Material[] | Modulo[]>([]);
    const [materiais, setMateriais] = useState<Material[]>([]);
    const [modulos, setModulos] = useState<Modulo[]>([]);
    const [contextoLista, setContextoLista] = useState<string>('MATERIAL');

    // STATES DE CONTROLE DAS BUSCAS DO MENU LATERAL
    const [buscaGeral, setBuscaGeral] = useState('');
    const [buscaEspecifica, setBuscaEspecifica] = useState('');
    const [auxiliarBuscaEspecifica, setAuxiliarBuscaEspecifica] = useState('');

    // STATE DE TAB ATIVA
    const [activeTab, setActiveTab] = useState<"materiais" | "relatorios">("materiais");

    useEffect(() => {
        if (!isAuthenticated) router.push('/');
    }, [isAuthenticated]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchMateriais = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materiais/`, {
                    headers: { authorization: `Bearer ${token}` }
                });
                const data = await res.json();

                setMateriais(data.materiais || []);
                setItens(data.materiais || []);
            } catch (error) {
                console.error("Erro ao buscar materiais:", error);
            }
        };

        fetchMateriais();
    }, []);

    const handleLogout = () => {
        let sair = confirm("Deseja realmente sair?");
        if (sair) logout()
    };

    return (
        <>
            <header className="dashboard-header">
                {isAuthenticated && user ? (
                    <div className="contexto-usuario">
                        <p className="user-info">
                            {user.pg}. {user.nome} <br />
                            <strong>{user.perfil}</strong>
                        </p>
                        <button className="btn-logout" onClick={handleLogout}>Sair</button>
                    </div>
                ) : (
                    <p>Carregando usuário...</p>
                )}

                {/* Tabs no header */}
                <ul className="tabs-menu">
                    <li
                        className={activeTab === "materiais" ? "active" : ""}
                        onClick={() => setActiveTab("materiais")}
                    >
                        Materiais
                    </li>
                    <li
                        className={activeTab === "relatorios" ? "active" : ""}
                        onClick={() => setActiveTab("relatorios")}
                    >
                        Relatórios
                    </li>
                </ul>
            </header>

            <main className="dashboard-container">
                {activeTab === "materiais" && (
                    <>
                        <MenuLateral
                            itens={itens}
                            setContextoLista={setContextoLista}
                            auxiliarBuscaEspecifica={auxiliarBuscaEspecifica}
                            buscaEspecifica={buscaEspecifica}
                            buscaGeral={buscaGeral}
                            setAuxiliarBuscaEspecifica={setAuxiliarBuscaEspecifica}
                            setBuscaEspecifica={setBuscaEspecifica}
                            setBuscaGeral={setBuscaGeral}
                        />
                        <section className="conteudo">
                            <GerarLista
                                parametrosDeBusca={contextoLista}
                                setItens={setItens}
                                setContextoLista={setContextoLista}
                                auxiliarBuscaEspecifica={auxiliarBuscaEspecifica}
                                setModulos={setModulos}
                                setMateriais={setMateriais}
                                materiais={materiais}
                                modulos={modulos}
                            />
                        </section>
                    </>
                )}

                {activeTab === "relatorios" && (
                    <Relatorios />
                )}
            </main>
        </>
    );
}
