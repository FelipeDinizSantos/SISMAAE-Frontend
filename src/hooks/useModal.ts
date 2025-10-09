import { useState } from "react";

export default function useModal(){
    const [modal, setModal] = useState<{ type: "novo" | "listar" | "editar" | null, itemId?: number }>({ type: null });

    const abrirModal = (itemId:number) => setModal({type: "novo", itemId});
    const abrirModalListar = (itemId:number) => setModal({type: "listar", itemId}); 
    const fecharModal = () => setModal({type: null});

    return{
        modal,
        abrirModal,
        abrirModalListar,
        fecharModal
    }
}