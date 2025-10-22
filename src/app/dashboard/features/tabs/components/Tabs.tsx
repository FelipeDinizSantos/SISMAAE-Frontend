import "../styles.css";

import { useAuth } from "@/context/AuthContext";
import { Role } from "@/interfaces/Role.interface";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { TabConfig } from "../interfaces";

export default function Tabs() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const tabs: readonly TabConfig[] = [
    {
      key: "materiais",
      label: "Materiais",
      allowed: ["ADMIN", "COMANDO", "COL", "S4", "MECANICO"],
    },
    {
      key: "relatorios",
      label: "Relatórios",
      allowed: ["ADMIN", "COMANDO", "COL", "S4", "MECANICO"],
    },
    {
      key: "controle-de-registros",
      label: "Controle de registros",
      allowed: ["ADMIN", "COMANDO", "COL"],
    },
  ];

  const availableTabs = useMemo(
    () =>
      tabs.filter((tab) => user && tab.allowed.includes(user.perfil as Role)),
    [user]
  );

  const activeTab = useMemo(() => {
    const match = availableTabs.find((tab) => pathname.includes(tab.key));
    return match ? match.key : availableTabs[0]?.key ?? "materiais";
  }, [pathname, availableTabs]);

  const handleTabClick = (key: TabConfig["key"]) => {
    if (pathname.endsWith(key)) return;
    router.push(`/dashboard/${key}`);
  };

  const handleLogout = () => {
    if (confirm("Deseja realmente sair?")) logout();
  };

  return (
    <header className="dashboard-header">
      {isAuthenticated && user ? (
        <div className="contexto-usuario">
          <p className="user-info">
            {user.pg}. {user.nome} <br />
            <strong>
              {user.batalhao} - {user.perfil}
            </strong>
          </p>
          <button className="btn-logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      ) : (
        <p>Carregando usuário...</p>
      )}

      {/* Tabs dinâmicas */}
      <ul className="tabs-menu">
        {availableTabs.map((tab) => (
          <li
            key={tab.key}
            className={activeTab === tab.key ? "active" : ""}
            onClick={() => handleTabClick(tab.key)}
          >
            {tab.label}
          </li>
        ))}
      </ul>
    </header>
  );
}
