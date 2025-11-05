"use client";

import "../styles.css";
import { useState, useMemo } from "react";
import { usePaginacao } from "@/hooks/usePaginacao";
import useRegistros from "../hooks/useRegistros";
import formatarDataExibicao from "@/utils/formatarDataExibicao";

export default function ControleRegistros() {
  const [buscaCod, setBuscaCod] = useState("");
  const [dataDe, setDataDe] = useState("");
  const [dataAte, setDataAte] = useState("");

  const token = localStorage.getItem("token");
  const { registros } = useRegistros(token!);

  const registrosFiltrados = useMemo(() => {
    return registros.filter((r) => {
      const matchCod = r.cod.toLowerCase().includes(buscaCod.toLowerCase());
      const matchData =
        (!dataDe || new Date(r.data) >= new Date(dataDe)) &&
        (!dataAte || new Date(r.data) <= new Date(dataAte));
      return matchCod && matchData;
    });
  }, [buscaCod, dataDe, dataAte, registros]);

  const itensPorPagina = 20;
  const { itensPaginados, paginaAtual, setPaginaAtual, totalPaginas } =
    usePaginacao(itensPorPagina, registrosFiltrados);

  return (
    <div className="registros-container">
      <div className="registros-lista">
        <h3 className="filtros-registros">Filtros de busca</h3>

        <div className="filtro-bloco">
          <label htmlFor="cod">Código:</label>
          <input
            id="cod"
            type="text"
            placeholder="Buscar por código..."
            value={buscaCod}
            onChange={(e) => setBuscaCod(e.target.value)}
            className="filtro-input"
          />
        </div>

        <div className="filtro-bloco">
          <label>Período:</label>
          <div className="filtro-periodo">
            <input
              type="date"
              value={dataDe}
              onChange={(e) => setDataDe(e.target.value)}
            />
            <span>até</span>
            <input
              type="date"
              value={dataAte}
              onChange={(e) => setDataAte(e.target.value)}
            />
          </div>
        </div>

        <div className="resumo-filtros">
          <p>
            <strong>{registrosFiltrados.length}</strong> registro(s)
            encontrado(s)
          </p>
          <button
            className="btn-limpar-filtros"
            onClick={() => {
              setBuscaCod("");
              setDataDe("");
              setDataAte("");
            }}
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <div className="controle-registros-conteudo">
        <h2 className="titulo-relatorio">Controle de Registros</h2>

        {registrosFiltrados.length === 0 ? (
          <p className="placeholder">Nenhum registro encontrado.</p>
        ) : (
          <>
            <div className="tabela-registros">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Ação</th>
                    <th>Automático/Manual</th>
                    <th>Criado por</th>
                    <th>Batalhão</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {itensPaginados.map((r) => (
                    <tr key={r.id}>
                      <td>{r.cod}</td>
                      <td>{r.acao}</td>
                      <td>
                        <span
                          className={`tag ${
                            r.automatico ? "tag-auto" : "tag-manual"
                          }`}
                        >
                          {r.automatico ? "Automático" : "Manual"}
                        </span>
                      </td>
                      <td>
                        {!r.automatico ? (
                          <>
                            <small>{r.mecanico_posto}</small> <br />
                            {r.mecanico_nome}
                          </>
                        ) : (
                          `-`
                        )}
                      </td>
                      <td>
                        {r.mecanico_batalhao ? `${r.mecanico_batalhao}` : `-`}
                      </td>
                      <td>{formatarDataExibicao(r.data)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="tabs-container">
              {Array.from({ length: totalPaginas }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setPaginaAtual(idx)}
                  className={`tab-button ${
                    idx === paginaAtual ? "active" : ""
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="info-paginacao">
              Mostrando {itensPaginados.length} de {registrosFiltrados.length}{" "}
              registros
            </div>
          </>
        )}
      </div>
    </div>
  );
}
