'use client';

import "../../../../../styles/tableView.style.css";

import { Material } from "@/interfaces/Material.interface";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modulo } from "@/interfaces/Modulo.interface";
import { usePermissao } from "@/hooks/usePermissao";
import Modal from "@/components/Modal";
import { CriarRegistro } from "../../registros/index";
import { ListaRegistros } from "../../registros/index";
import { useAuth } from "@/context/AuthContext";
import MenuContexto from "@/components/MenuContexto";
import { useEdicaoMateriais } from "../hooks/useEdicaoMateriais";
import { useBatalhao } from "@/hooks/useBatalhao";
import { usePaginacao } from "@/hooks/usePaginacao";
import useModal from "../../../../../hooks/useModal";
import FuncoesTabela from "@/app/dashboard/components/FuncoesTabela";

export default function ListaMateriais(
    {
        materiais,
        setMateriais,
        setItens,
        setReload
    }
        :
        {
            materiais: Material[],
            setMateriais: Dispatch<SetStateAction<Material[]>>,
            setItens: Dispatch<SetStateAction<Material[] | Modulo[]>>
            setReload: Dispatch<SetStateAction<boolean>>
        }
) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const { podeEditar } = usePermissao();
    const { user } = useAuth();

    const { batalhoes } = useBatalhao(token);
    const { materiaisEditaveis, setMateriaisEditaveis, iniciarEdicao, cancelarEdicao, confirmarEdicao } =
        useEdicaoMateriais(materiais, setMateriais, batalhoes, user, setItens);

    // Estados para os menus dos itens da lista. (Botão Direito) 
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        mat: Material | null;
    }>({
        visible: false,
        x: 0,
        y: 0,
        mat: null,
    });

    const { modal, abrirModal, abrirModalListar, fecharModal } = useModal();

    const itensPorPagina = 5;
    const { itensPaginados, paginaAtual, setPaginaAtual, totalPaginas } = usePaginacao(itensPorPagina, materiaisEditaveis);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMateriaisEditaveis(materiais.map(mat => ({ ...mat })));
        setLoading(false);
    }, [materiais]);

    const handleDisponibilidadeChange = (index: number, novoValor: 'DISPONIVEL' | 'DISP_C_RESTRICAO' | 'INDISPONIVEL' | 'MANUTENCAO') => {
        const novosMateriais = [...materiaisEditaveis];
        novosMateriais[index] = {
            ...novosMateriais[index],
            Disponibilidade: novoValor
        };
        setMateriaisEditaveis(novosMateriais);
    };

    const handleOmAtualChange = (index: number, novoValor: string) => {
        const novosMateriais = [...materiaisEditaveis];
        novosMateriais[index] = {
            ...novosMateriais[index],
            OM_Atual: novoValor
        }
        setMateriaisEditaveis(novosMateriais);
    }

    const handleObsChange = (index: number, novoValor: string) => {
        const novosMateriais = [...materiaisEditaveis];
        novosMateriais[index] = {
            ...novosMateriais[index],
            Obs: novoValor
        };
        setMateriaisEditaveis(novosMateriais);
    };

    return (
        <div className="table-view-container">
            <nav>
                <h3>Lista de Materiais</h3>
            </nav>

            <FuncoesTabela
                itensEditaveis={materiaisEditaveis}
                setItensEditaveis={setMateriaisEditaveis}
                handleReload={() => setReload(true)}
            />

            {loading ? (
                <p>Carregando...</p>
            ) : materiaisEditaveis.length === 0 ? (
                <>
                    <div className="lista-vazia">
                        <p>Nenhum material encontrado.</p>
                    </div>
                </>
            ) : (
                <div className="tabela-wrapper">
                    <table className="table-view">
                        <thead>
                            <tr>
                                <th>Material</th>
                                <th>SN</th>
                                <th>Disponibilidade</th>
                                <th>OM Origem</th>
                                <th>OM Atual</th>
                                <th>Obs</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itensPaginados.map((mat, idx) => {
                                const realIndex = paginaAtual * itensPorPagina + idx;
                                return (
                                    <tr key={realIndex}>
                                        <td>{mat.Material}</td>
                                        <td>{mat.SN}</td>
                                        <td className={`status ${mat.Disponibilidade.toLowerCase()}`}>
                                            {mat.editando ? (
                                                <select
                                                    value={mat.Disponibilidade}
                                                    onChange={(e) => handleDisponibilidadeChange(
                                                        realIndex,
                                                        e.target.value as 'DISPONIVEL' | 'DISP_C_RESTRICAO' | 'INDISPONIVEL' | 'MANUTENCAO'
                                                    )}
                                                    className="select-disponibilidade"
                                                >
                                                    <option value="DISPONIVEL">DISPONIVEL</option>
                                                    <option value="DISP_C_RESTRICAO">DISP_C_RESTRICAO</option>
                                                    <option value="INDISPONIVEL">INDISPONIVEL</option>
                                                    <option value="MANUTENCAO">MANUTENCAO</option>
                                                </select>
                                            ) : (
                                                <p>{mat.Disponibilidade}</p>
                                            )}
                                        </td>
                                        <td>{mat.OM_Origem}</td>
                                        <td>
                                            {mat.editando && podeEditar("materiais", "omAtual") ? (
                                                <select
                                                    value={mat.OM_Atual}
                                                    onChange={(e) => handleOmAtualChange(realIndex, e.target.value)}
                                                    className="select-disponibilidade"
                                                >
                                                    <option value="">Selecione</option>
                                                    {batalhoes.map(b => (
                                                        <option key={b.id} value={b.id}>{b.sigla}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span>
                                                    {batalhoes.find(b => String(b.id) === String(mat.OM_Atual))?.sigla || mat.OM_Atual}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {mat.editando ? (
                                                <input
                                                    type="text"
                                                    value={mat.Obs}
                                                    onChange={(e) => handleObsChange(realIndex, e.target.value)}
                                                    className="input-observacao"
                                                    placeholder="Digite a observação"
                                                />
                                            ) : (
                                                <span>{mat.Obs}</span>
                                            )}
                                        </td>
                                        <td>
                                            {mat.editando ? (
                                                <div className="botoes-edicao">
                                                    <button
                                                        className="btn-confirmar"
                                                        onClick={() => confirmarEdicao(realIndex)}
                                                        title="Confirmar edição"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        className="btn-cancelar"
                                                        onClick={() => cancelarEdicao(realIndex)}
                                                        title="Cancelar edição"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="acoes-container">
                                                    <button
                                                        className={`btn-acoes`}
                                                        onClick={() =>
                                                            setContextMenu({
                                                                visible:
                                                                    contextMenu.visible && contextMenu.mat?.id === mat.id
                                                                        ? false
                                                                        : true,
                                                                x: 0,
                                                                y: 0,
                                                                mat,
                                                            })
                                                        }
                                                    >
                                                        Gerenciar
                                                    </button>

                                                    {contextMenu.visible && contextMenu.mat?.id === mat.id && (
                                                        <MenuContexto
                                                            x={0}
                                                            y={0}
                                                            visible={contextMenu.visible}
                                                            onClose={() => setContextMenu({ ...contextMenu, visible: false })}
                                                            options={[
                                                                {
                                                                    label: "Editar",
                                                                    onClick: () => iniciarEdicao(realIndex),
                                                                },
                                                                ...(["MECANICO", "COL"].includes(user!.perfil)
                                                                    ? [
                                                                        {
                                                                            label: "Criar Novo Registro",
                                                                            onClick: () => abrirModal(mat.id),
                                                                        },
                                                                    ]
                                                                    : []),
                                                                {
                                                                    label: "Visualizar Registros",
                                                                    onClick: () => abrirModalListar(mat.id),
                                                                },
                                                            ]}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Tabs/Paginação */}
                    <div className="tabs-container">
                        {Array.from({ length: totalPaginas }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPaginaAtual(idx)}
                                className={`tab-button ${idx === paginaAtual ? "active" : ""}`}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                    {/* Info de quantos estão sendo exibidos */}
                    <div className="info-paginacao">
                        Mostrando {itensPaginados.length} de {materiaisEditaveis.length} materiais
                    </div>

                    {/* Modais de exibição */}
                    <Modal
                        visible={modal.type === "novo"}
                        title="Criar Registro"
                        onClose={() => fecharModal()}
                    >
                        <CriarRegistro
                            materialId={modal.itemId!}
                            moduloId={null}
                            mecanicoId={user ? user.id : 0}
                            onSuccess={() => fecharModal()}
                        />
                    </Modal>

                    <Modal
                        visible={modal.type === "listar"}
                        title="Registros do Material"
                        onClose={() => fecharModal()}
                    >
                        <ListaRegistros itemId={modal.itemId!} isMaterial />
                    </Modal>
                </ div>
            )}
        </div>
    )
}
