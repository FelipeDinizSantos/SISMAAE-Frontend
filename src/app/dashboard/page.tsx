'use client';

import "./Dashboard.css";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import MenuLateral from "./components/MenuLateral";
import ListaMateriais from "./components/ListaMateriais";

interface Material {
    id: number;
    Material: string;
    SN: string;
    Disponibilidade: 'DISPONIVEL' | 'DISP_C_RESTRICAO' | 'INDISPONIVEL' | 'MANUTENCAO';
    OM_Origem: string;
    OM_Atual: string;
    Obs: string;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuth();
    const [materiais, setMateriais] = useState<Material[]>([]);

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
            } catch (error) {
                console.error("Erro ao buscar materiais:", error);
            }
        };

        fetchMateriais();
    }, []);

    const handleLogout = ()=>{
        let sair = confirm("Deseja realmente sair?")

        if(sair) logout()
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
                        <button className="btn-logout" onClick={()=>handleLogout()}>Sair</button>
                    </>
                ) : (
                    <p>Carregando usuário...</p>
                )}
            </header>

            <main className="dashboard-container">
                <MenuLateral materiais={materiais} />
                <section className="conteudo">
                    <ListaMateriais 
                        materiais={materiais}
                        setMateriais={setMateriais}
                    />
                </section>
            </main>
        </>
    );
}