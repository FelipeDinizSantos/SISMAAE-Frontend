import { useState } from "react";

export function usePaginacao<T>(
    itensPorPagina: number,
    itens: T[]
) {
    const [paginaAtual, setPaginaAtual] = useState(0);
    const totalPaginas = Math.ceil(itens.length / itensPorPagina);

    const itensPaginados: T[] = itens.slice(
        paginaAtual * itensPorPagina,
        (paginaAtual + 1) * itensPorPagina
    );

    return {
        paginaAtual,
        setPaginaAtual,
        totalPaginas,
        itensPaginados
    };
}
