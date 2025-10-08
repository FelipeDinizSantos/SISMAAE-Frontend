import "../styles.css";

import { Material } from "@/interfaces/Material.interface";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modulo } from "@/interfaces/Modulo.interface";
import { usePermissao } from "@/hooks/usePermissao";
import { Batalhao } from "@/interfaces/Batalhao.interface";
import Modal from "@/components/Modal";
import { CriarRegistro } from "../../registros/index";
import { ListaRegistros } from "../../registros/index";
import { useAuth } from "@/context/AuthContext";
import criarRegistroAutomatico from "@/utils/criarRegistroAutomatico";
import MenuManipulacaoTabela from "./FuncoesTabela";
import { toast } from 'react-hot-toast';
import MenuContexto from "@/components/MenuContexto";
import { MaterialEditado } from "../interfaces";

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
    const [batalhoes, setBatalhoes] = useState<Batalhao[]>([]);
    const [materiaisEditaveis, setMateriaisEditaveis] = useState<MaterialEditado[]>([]);

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
    const [modal, setModal] = useState<{ type: "novo" | "listar" | "editar" | null, materialId?: number }>({ type: null });

    const { podeEditar } = usePermissao();
    const { user } = useAuth();

    // Paginação
    const [paginaAtual, setPaginaAtual] = useState(0);
    const itensPorPagina = 5;
    const totalPaginas = Math.ceil(materiaisEditaveis.length / itensPorPagina);

    const materiaisPaginados = materiaisEditaveis.slice(
        paginaAtual * itensPorPagina,
        (paginaAtual + 1) * itensPorPagina
    );

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const fetchBatalhoes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/batalhoes`, {
                    headers: { 'Authorization': `Barear ${token}` }
                });
                if (!res.ok) throw new Error("Erro ao carregar batalhões");
                const data = await res.json();
                setBatalhoes(data.batalhoes);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    toast.error(err.message);
                } else {
                    toast.error("Ocorreu um erro inesperado!");
                }
            }
        }

        fetchBatalhoes();
    }, []);

    useEffect(() => {
        setMateriaisEditaveis(materiais.map(mat => ({ ...mat })));
    }, [materiais]);

    const iniciarEdicao = (index: number) => {
        const novosMateriais = materiaisEditaveis.map((mat, i) => {

            if (mat.editando && i !== index) {
                return {
                    ...mat,
                    editando: false,
                    OM_Atual: mat.OM_Atual_Original || mat.OM_Atual,
                    Disponibilidade: mat.disponibilidadeOriginal as 'DISPONIVEL' | 'DISP_C_RESTRICAO' | 'INDISPONIVEL' | 'MANUTENCAO',
                    Obs: mat.obsOriginal || mat.Obs
                };
            }

            if (i === index) {
                return {
                    ...mat,
                    editando: true,
                    OM_Atual_Original: mat.OM_Atual,
                    disponibilidadeOriginal: mat.Disponibilidade,
                    obsOriginal: mat.Obs
                };
            }
            return mat;
        });

        setMateriaisEditaveis(novosMateriais);
    };

    const cancelarEdicao = (index: number) => {
        const novosMateriais = [...materiaisEditaveis];
        novosMateriais[index] = {
            ...novosMateriais[index],
            editando: false,
            OM_Atual: novosMateriais[index].OM_Atual_Original || '',
            Disponibilidade: novosMateriais[index].disponibilidadeOriginal as 'DISPONIVEL' | 'DISP_C_RESTRICAO' | 'INDISPONIVEL' | 'MANUTENCAO',
            Obs: novosMateriais[index].obsOriginal || ''
        };
        setMateriaisEditaveis(novosMateriais);
    };

    const confirmarEdicao = async (index: number) => {
        const novosMateriais = [...materiaisEditaveis];
        const materialEditado = {
            ...novosMateriais[index],
            editando: false
        };

        novosMateriais[index] = materialEditado;
        setMateriaisEditaveis(novosMateriais);

        const { editando, disponibilidadeOriginal, obsOriginal, ...materialSemPropriedadesEditaveis } = materialEditado;

        setMateriais(prevMateriais =>
            prevMateriais.map((mat, i) =>
                i === index ? materialSemPropriedadesEditaveis : mat
            )
        );

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const body: any = {
                status: materiaisEditaveis[index].Disponibilidade,
                obs: materiaisEditaveis[index].Obs,
            };

            let mudouOM = false;

            if (materiaisEditaveis[index].OM_Atual !== materiaisEditaveis[index].OM_Atual_Original) {
                mudouOM = true;
                const novoLoc = batalhoes.find(
                    (bat) => bat.id === parseInt(materiaisEditaveis[index].OM_Atual)
                )?.id;
                if (novoLoc) {
                    body.loc_id = novoLoc;
                }
            }

            const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materiais/${materiais[index].id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });


            if (!result.ok) {
                const erro = await result.json();
                throw new Error(erro.erro || "Erro inesperado.");
            }

            await result.json();
            toast.success("Material editado");

            setItens(materiaisEditaveis =>
                materiaisEditaveis.map((mat, i) =>
                    i === index ? materialSemPropriedadesEditaveis : mat
                )
            );

            // ========================================================================
            // AREA PARA MANIPULAÇÃO DE REGISTROS REFERENTE A ATUALIZAÇÃO DE MATERIAIS  
            // ========================================================================

            // Cria registro automatico para mudança da OM_ATUAL
            if (mudouOM) {
                const omAnterior = batalhoes.find(
                    b => String(b.id) === String(materiaisEditaveis[index].OM_Atual_Original)
                )?.sigla || materiaisEditaveis[index].OM_Atual_Original;

                const omNova = batalhoes.find(
                    b => String(b.id) === String(materiaisEditaveis[index].OM_Atual)
                )?.sigla || materiaisEditaveis[index].OM_Atual;

                const acao = `TRANSFERÊNCIA DE OM: ${omAnterior} → ${omNova}`;

                await criarRegistroAutomatico({
                    materialId: materiais[index].id,
                    moduloId: null,
                    acao,
                    user
                });
            }
            // Cria registro automatico para mudança de DISPONIBILIDADE DO CABIDE
            if (materiaisEditaveis[index].Disponibilidade !== materiaisEditaveis[index].disponibilidadeOriginal) {
                const dispAnterior = materiaisEditaveis[index].disponibilidadeOriginal;
                const dispNova = materiaisEditaveis[index].Disponibilidade;

                const acao = `ALTERAÇÃO DE DISPONIBILIDADE: ${dispAnterior} → ${dispNova}`;

                await criarRegistroAutomatico({
                    materialId: materiais[index].id,
                    moduloId: null,
                    acao,
                    user
                });
            }
            // Cria registro automatico para mudança de OBSERVAÇÃO
            if (materiaisEditaveis[index].Obs !== materiaisEditaveis[index].obsOriginal) {
                const obsAnterior = materiaisEditaveis[index].obsOriginal;
                const obsNova = materiaisEditaveis[index].Obs;

                const acao = `ALTERAÇÃO DE OBSERVAÇÃO: ${obsAnterior} → ${obsNova}`;

                await criarRegistroAutomatico({
                    materialId: materiais[index].id,
                    moduloId: null,
                    acao,
                    user
                });
            }

        } catch (error: unknown) {
            cancelarEdicao(index);

            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Ocorreu um erro inesperado!");
            }
        }
    };

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
        <div className="materiais-container">
            <nav>
                <h3>Lista de Materiais</h3>
                <MenuManipulacaoTabela
                    handleReload={() => setReload(true)}
                />
            </nav>

            {materiaisEditaveis.length > 0 ? (
                <>
                    <table className="materiais-tabela">
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
                            {materiaisPaginados.map((mat, idx) => {
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
                                                                            onClick: () =>
                                                                                setModal({ type: "novo", materialId: mat.id }),
                                                                        },
                                                                    ]
                                                                    : []),
                                                                {
                                                                    label: "Visualizar Registros",
                                                                    onClick: () =>
                                                                        setModal({ type: "listar", materialId: mat.id }),
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
                        Mostrando {materiaisPaginados.length} de {materiaisEditaveis.length} materiais
                    </div>

                    {/* Modais de exibição */}
                    <Modal
                        visible={modal.type === "novo"}
                        title="Criar Registro"
                        onClose={() => setModal({ type: null })}
                    >
                        <CriarRegistro
                            materialId={modal.materialId!}
                            moduloId={null}
                            mecanicoId={user ? user.id : 0}
                            onSuccess={() => setModal({ type: null })}
                        />
                    </Modal>

                    <Modal
                        visible={modal.type === "listar"}
                        title="Registros do Material"
                        onClose={() => setModal({ type: null })}
                    >
                        <ListaRegistros itemId={modal.materialId!} isMaterial />
                    </Modal>
                </>
            ) : (
                <p>Carregando materiais...</p>
            )}
        </div>
    )
}
