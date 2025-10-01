import { IoReloadSharp as ReloadIcon } from "react-icons/io5";
import { useState } from "react";
import "./MenuManipulacaoTabela.css";

export default function MenuManipulacaoTabela({ handleReload }: { handleReload: () => void }) {
    const [animando, setAnimando] = useState(false);

    const handleClick = () => {
        setAnimando(true);
        handleReload();
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
