import "../styles.css";

import { IoReloadSharp as ReloadIcon } from "react-icons/io5";
import { useState } from "react";
import toast from "react-hot-toast";

export default function FuncoesTabela({ handleReload }: { handleReload: () => void }) {
    const [animando, setAnimando] = useState(false);

    const handleClick = () => {
        setAnimando(true);
        handleReload();

        toast.success("Dados atualizados");
        setTimeout(() => setAnimando(false), 600); 
    };

    return (
        <div className="menu-manip-container">
            <button 
                className={`menu-btn ${animando ? "spin" : ""}`} 
                onClick={handleClick} 
                title="Atualizar lista"
            >
                <ReloadIcon />
            </button>
        </div>
    );
}
