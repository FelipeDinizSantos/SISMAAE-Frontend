'use client';

import "./Dashboard.css";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import MenuLateral from "./components/MenuLateral";
import ListaMateriais from "./components/ListaMateriais";
import { Material } from "@/interfaces/Material.interface";
import { Modulo } from "@/interfaces/Modulo.interface";
import ListaModulos from "./components/ListaModulos/page";

export default function DashboardPage() {
    const router = useRouter();

    const { user, isAuthenticated, logout } = useAuth();
    const [contextoLista, setContextoLista] = useState<string>('MATERIAL');

    const [itens, setItens] = useState<Material[] | Modulo[]>([]);
    const [materiais, setMateriais] = useState<Material[]>([]);
    const [modulos, setModulos] = useState<Modulo[]>([]);

    // STATES DE CONTROLE DAS BUSCAS DO MENU LATERAL
    const [buscaGeral, setBuscaGeral] = useState('');
    const [buscaEspecifica, setBuscaEspecifica] = useState('');
    const [auxiliarBuscaEspecifica, setAuxiliarBuscaEspecifica] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        if (contextoLista === "MODULO-NOME" && auxiliarBuscaEspecifica) {
            try {
                let fetchData = async () => {
                    let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modulos?nome=${auxiliarBuscaEspecifica.toUpperCase()}`, {
                        headers: { authorization: `Barear ${token}` }
                    });

                    let data = await res.json();

                    setItens(data.resultado);
                    setModulos(data.resultado);
                }

                fetchData();
            } catch (error) {
                console.error("Erro ao buscar modulos:", error);
            }
        }
        if (contextoLista === "MATERIAL") {
            const fetchMateriais = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materiais/`, {
                        headers: { authorization: `Barear ${token}` }
                    });
                    const data = await res.json();

                    setMateriais(data.resultado || []);
                    setItens(data.resultado || []);
                } catch (error) {
                    console.error("Erro ao buscar materiais:", error);
                }
            };

            fetchMateriais();
        }

    }, [contextoLista, auxiliarBuscaEspecifica])

    useEffect(() => {
        if (!isAuthenticated) router.push('/');
    }, [isAuthenticated]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchMateriais = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materiais/`, {
                    headers: { authorization: `Barear ${token}` }
                });
                const data = await res.json();

                setMateriais(data.resultado || []);
                setItens(data.resultado || []);
            } catch (error) {
                console.error("Erro ao buscar materiais:", error);
            }
        };

        fetchMateriais();
    }, []);

    const handleLogout = () => {
        let sair = confirm("Deseja realmente sair?")

        if (sair) logout()
        else return;
    }

    return (
        <>
            <header className="dashboard-header">
                {isAuthenticated && user ? (
                    <>
                        <p className="user-info">
                            {user.pg}. {user.nome} <br />
                            <strong>{user.perfil}</strong>
                        </p>
                        <button className="btn-logout" onClick={() => handleLogout()}>Sair</button>
                    </>
                ) : (
                    <p>Carregando usuário...</p>
                )}
            </header>

            <main className="dashboard-container">
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

                    {
                        contextoLista === "MATERIAL" && (
                            <ListaMateriais
                                materiais={materiais}
                                setMateriais={setMateriais}
                                setItens={setItens}
                            />
                        )
                    }

                    {
                        contextoLista === "MODULO-NOME" && (
                            <ListaModulos
                                modulos={modulos}
                                setItens={setItens}
                                setModulos={setModulos}
                            />
                        )
                    }

                </section>
            </main>
        </>
    );
}