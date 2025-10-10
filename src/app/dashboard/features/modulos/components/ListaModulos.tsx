import "../styles.css";

import { Material } from "@/interfaces/Material.interface";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modulo } from "@/interfaces/Modulo.interface";
import { usePermissao } from "@/hooks/usePermissao";
import MenuManipulacaoTabela from "./FuncoesTabela";
import MenuContexto from "@/components/MenuContexto";
import Modal from "@/components/Modal";
import { CriarRegistro } from "../../registros/index";
import { ListaRegistros } from "../../registros/index";
import { useAuth } from "@/context/AuthContext";
import { ModuloEditado } from "../interfaces";
import { useEdicaoModulos } from "../hooks/useEdicaoModulos";
import { useBatalhao } from "@/hooks/useBatalhao";
import { usePaginacao } from "@/hooks/usePaginacao";
import useModal from "@/hooks/useModal";
import useCabides from "../../../../../hooks/useCabides";

export default function ListaModulos(
    {
        modulos,
        setModulos,
        setItens,
        setReload
    }
        :
        {
            modulos: Modulo[],
            setModulos: Dispatch<SetStateAction<Modulo[]>>,
            setItens: Dispatch<SetStateAction<Material[] | Modulo[]>>,
            setReload: Dispatch<SetStateAction<boolean>>
        }
) {
    const token = localStorage.getItem('token');
    if (!token) return;

    const { podeEditar } = usePermissao();
    const { user } = useAuth();

    // Estados para os menus dos itens da lista. (Botão Direito) 
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        mod: Modulo | null;
    }>({
        visible: false,
        x: 0,
        y: 0,
        mod: null,
    });

    const [loading, setLoading] = useState(true);

    const { modal, abrirModal, abrirModalListar, fecharModal } = useModal();
    const { batalhoes } = useBatalhao(token);
    const { cabides } = useCabides(token);

    const { modulosEditaveis, setModulosEditaveis, iniciarEdicao, cancelarEdicao, confirmarEdicao } =
        useEdicaoModulos(modulos, setModulos, batalhoes, user, setItens, cabides);

    const itensPorPagina = 5;
    const { itensPaginados, paginaAtual, setPaginaAtual, totalPaginas } = usePaginacao(itensPorPagina, modulosEditaveis);

    useEffect(() => {
        setModulosEditaveis(modulos.map(mod => ({
            ...mod,
            editando: false,
            omOrigemId: mod.OM_Origem_Id,
            omDestinoId: mod.OM_Atual_Id,
            cabideSNSelecionado: mod.SN_do_Cabide,
        })));

        setLoading(false);
    }, [modulos]);

    const handleDisponibilidadeChange = (
        index: number,
        novoValor: 'DISPONIVEL' | 'DISP_C_RESTRICAO' | 'INDISPONIVEL' | 'MANUTENCAO'
    ) => {
        const novos = [...modulosEditaveis];
        novos[index] = {
            ...novos[index],
            Disponibilidade: novoValor
        };
        setModulosEditaveis(novos);
    };

    const handleObsChange = (index: number, novoValor: string) => {
        const novos = [...modulosEditaveis];
        novos[index] = {
            ...novos[index],
            Obs: novoValor
        };
        setModulosEditaveis(novos);
    };

    const handleOmChange = (index: number, campo: 'omOrigemId' | 'omDestinoId', valor: number) => {
        const novos = [...modulosEditaveis];
        novos[index] = {
            ...novos[index],
            [campo]: valor
        };
        setModulosEditaveis(novos);
    };

    const handleCabideChange = (index: number, novoSN: string) => {
        const novos = [...modulosEditaveis];

        const cabideSelecionado = cabides.find(cabide => cabide.SN === novoSN);

        novos[index] = {
            ...novos[index],
            cabideSNSelecionado: novoSN,
            Disponibilidade_do_Cabide: cabideSelecionado?.Disponibilidade || novos[index].Disponibilidade_do_Cabide
        };

        setModulosEditaveis(novos);
    };

    const getOmSelectValue = (mod: ModuloEditado, campo: 'omOrigemId' | 'omDestinoId') => {
        if (mod.editando) {
            return mod[campo] || '';
        }
        return '';
    };

    return (
        <div className="materiais-container">
            <nav>
                <h3>Lista de Modulos</h3>
                <MenuManipulacaoTabela
                    handleReload={() => setReload(true)}
                />
            </nav>

            {loading ? (
                <>
                    <div className="lista-vazia">
                        <p>Carregando...</p>
                    </div>
                </>
            ) : modulosEditaveis.length === 0 ? (
                <>
                    <div className="lista-vazia">
                        <p>Nenhum material encontrado.</p>
                    </div>
                </>
            ) : (
                <>
                    <table className="materiais-tabela">
                        <thead>
                            <tr>
                                <th>Módulo</th>
                                <th>SN</th>
                                <th>Disponibilidade</th>
                                <th >OM Origem</th>
                                <th>OM Atual</th>
                                <th>Material</th>
                                <th>SN do Cabide</th>
                                <th>Disponibilidade do Cabide</th>
                                <th>Obs</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itensPaginados.map((mod, idx) => {
                                const realIndex = paginaAtual * itensPorPagina + idx;
                                return (
                                    <tr key={realIndex}>
                                        <td>{mod.modulo}</td>
                                        <td>{mod.SN}</td>
                                        <td className={`status ${mod.Disponibilidade.toLowerCase()}`}>
                                            {mod.editando ? (
                                                <select
                                                    value={mod.Disponibilidade}
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
                                                <p>{mod.Disponibilidade}</p>
                                            )}
                                        </td>

                                        <td>
                                            <p>{mod.OM_Origem}</p>
                                        </td>

                                        <td>
                                            {mod.editando && podeEditar("modulos", "omAtual") ? (
                                                <select
                                                    value={getOmSelectValue(mod, 'omDestinoId')}
                                                    onChange={(e) => handleOmChange(realIndex, 'omDestinoId', Number(e.target.value))}
                                                    className="select-disponibilidade"
                                                >
                                                    <option value="">Selecione</option>
                                                    {batalhoes.map(b => (
                                                        <option key={b.id} value={b.id}>{b.sigla}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <p>{mod.OM_Atual}</p>
                                            )}
                                        </td>

                                        <td>{mod.Material}</td>

                                        <td>
                                            {mod.editando && podeEditar("modulos", "cabideSN") ? (
                                                <select
                                                    value={mod.cabideSNSelecionado || mod.SN_do_Cabide}
                                                    onChange={(e) => handleCabideChange(realIndex, e.target.value)}
                                                    className="select-disponibilidade"
                                                >
                                                    <option value="">Selecione um cabide</option>
                                                    <option value="Sem Cabide">Sem Cabide</option>
                                                    {cabides.map(cabide => (
                                                        <option key={cabide.id} value={cabide.SN}>
                                                            {cabide.SN} - {cabide.Material}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <p>{mod.SN_do_Cabide}</p>
                                            )}
                                        </td>

                                        <td className={`status ${mod.Disponibilidade_do_Cabide?.toLowerCase() || ''}`}>
                                            <p>{mod.Disponibilidade_do_Cabide}</p>
                                        </td>
                                        <td>
                                            {mod.editando ? (
                                                <input
                                                    type="text"
                                                    value={mod.Obs}
                                                    onChange={(e) => handleObsChange(realIndex, e.target.value)}
                                                    className="input-observacao"
                                                    placeholder="Digite a observação"
                                                />
                                            ) : (
                                                <span>{mod.Obs}</span>
                                            )}
                                        </td>
                                        <td>
                                            {mod.editando ? (
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
                                                                    contextMenu.visible && contextMenu.mod?.id === mod.id
                                                                        ? false
                                                                        : true,
                                                                x: 0,
                                                                y: 0,
                                                                mod,
                                                            })
                                                        }
                                                    >
                                                        Gerenciar
                                                    </button>

                                                    {contextMenu.visible && contextMenu.mod?.id === mod.id && (
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
                                                                            onClick: () => abrirModal(mod.id),
                                                                        },
                                                                    ]
                                                                    : []),
                                                                {
                                                                    label: "Visualizar Registros",
                                                                    onClick: () => abrirModalListar(mod.id),
                                                                },
                                                            ]}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
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
                        Mostrando {itensPaginados.length} de {modulosEditaveis.length} modulos
                    </div>

                    {/* Modais de exibição */}
                    <Modal
                        visible={modal.type === "novo"}
                        title="Criar Registro"
                        onClose={fecharModal}
                    >
                        <CriarRegistro
                            moduloId={modal.itemId!}
                            materialId={null}
                            mecanicoId={user ? user.id : 0}
                            onSuccess={fecharModal}
                        />
                    </Modal>

                    <Modal
                        visible={modal.type === "listar"}
                        title="Registros do Material"
                        onClose={fecharModal}
                    >
                        <ListaRegistros itemId={modal.itemId!} isMaterial={false} />
                    </Modal>
                </>
            )}
        </div>
    )
}