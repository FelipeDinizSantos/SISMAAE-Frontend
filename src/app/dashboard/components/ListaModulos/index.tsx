import "../ListaMateriais/ListaMateriais.css"; // USA A MESMA ESTILIZAÇÃO DE "LISTAMATERIAIS"

import { Material } from "@/interfaces/Material.interface";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modulo } from "@/interfaces/Modulo.interface";
import { usePermissao } from "@/hooks/usePermissao";
import MenuManipulacaoTabela from "../MenuManipulacaoTabela";
import MenuContexto from "@/components/MenuContexto";
import Modal from "@/components/Modal";
import FormRegistro from "../CriarRegistro";
import ListaRegistros from "../ListaRegistros";
import { useAuth } from "@/context/AuthContext";
import criarRegistroAutomatico from "@/utils/criarRegistroAutomatico";

interface ModuloEditado extends Modulo {
    editando?: boolean;
    disponibilidadeOriginal?: string;
    obsOriginal?: string;
    omOrigemId?: number;
    omDestinoId?: number;
    cabideSNOriginal?: string;
    cabideSNSelecionado?: string;
    semCabide?: string;
}

interface Batalhao {
    id: number;
    nome: string;
    sigla: string;
}

interface MaterialAPI {
    id: number;
    Material: string;
    SN: string;
    Disponibilidade: string;
    OM_Origem: string;
    OM_Atual: string;
    Obs: string;
}

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
    const [modulosEditaveis, setModulosEditaveis] = useState<ModuloEditado[]>([]);
    const [batalhoes, setBatalhoes] = useState<Batalhao[]>([]);
    const [cabidesDisponiveis, setCabidesDisponiveis] = useState<MaterialAPI[]>([]);

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
    const [modal, setModal] = useState<{ type: "novo" | "listar" | "editar" | null, materialId?: number }>({ type: null });

    // Paginação
    const [paginaAtual, setPaginaAtual] = useState(0);
    const itensPorPagina = 5;
    const totalPaginas = Math.ceil(modulosEditaveis.length / itensPorPagina);

    let modulosPaginados = modulosEditaveis.slice(
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
            } catch (err) {
                console.error(err);
            }
        };

        const fetchCabides = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materiais/`, {
                    headers: { 'Authorization': `Barear ${token}` }
                });
                if (!res.ok) throw new Error("Erro ao carregar cabides");
                const data = await res.json();
                setCabidesDisponiveis(data.materiais);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBatalhoes();
        fetchCabides();
    }, []);

    useEffect(() => {
        setModulosEditaveis(modulos.map(mod => ({
            ...mod,
            editando: false,
            omOrigemId: mod.OM_Origem_Id,
            omDestinoId: mod.OM_Atual_Id,
            cabideSNSelecionado: mod.SN_do_Cabide,
        })));
    }, [modulos]);

    const iniciarEdicao = (index: number) => {
        const novos = modulosEditaveis.map((mod, i) => {
            if (mod.editando && i !== index) {
                return {
                    ...mod,
                    editando: false,
                    Disponibilidade: mod.disponibilidadeOriginal as 'DISPONIVEL' | 'DISP_C_RESTRICAO' | 'INDISPONIVEL' | 'MANUTENCAO',
                    Obs: mod.obsOriginal || '',
                    omOrigemId: mod.OM_Origem_Id,
                    omDestinoId: mod.OM_Atual_Id,
                    cabideSNSelecionado: mod.cabideSNOriginal
                };
            }

            if (i === index) {
                return {
                    ...mod,
                    editando: true,
                    disponibilidadeOriginal: mod.Disponibilidade,
                    obsOriginal: mod.Obs,
                    omOrigemId: mod.OM_Origem_Id,
                    omDestinoId: mod.OM_Atual_Id,
                    cabideSNOriginal: mod.SN_do_Cabide,
                    cabideSNSelecionado: mod.SN_do_Cabide
                };
            }

            return mod;
        });

        setModulosEditaveis(novos);
    };

    const cancelarEdicao = (index: number) => {
        const novos = [...modulosEditaveis];
        novos[index] = {
            ...novos[index],
            editando: false,
            Disponibilidade: novos[index].disponibilidadeOriginal as 'DISPONIVEL' | 'DISP_C_RESTRICAO' | 'INDISPONIVEL' | 'MANUTENCAO',
            Obs: novos[index].obsOriginal || '',
            omOrigemId: novos[index].OM_Origem_Id,
            omDestinoId: novos[index].OM_Atual_Id,
            cabideSNSelecionado: novos[index].cabideSNOriginal
        };
        setModulosEditaveis(novos);
    };

    const confirmarEdicao = async (index: number) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const moduloEditado = modulosEditaveis[index];

            if (moduloEditado.cabideSNSelecionado === "Sem Cabide") {
                modulos[index].Disponibilidade_do_Cabide = " ";
            }

            let corpoRequisicaoComCabide;

            if (moduloEditado.cabideSNSelecionado === "Sem Cabide") {
                corpoRequisicaoComCabide = {
                    status: moduloEditado.Disponibilidade,
                    obs: moduloEditado.Obs,
                    loc_id: moduloEditado.omDestinoId,
                    isSemCabide: true,
                }
            } else {
                corpoRequisicaoComCabide = {
                    status: moduloEditado.Disponibilidade,
                    obs: moduloEditado.Obs,
                    loc_id: moduloEditado.omDestinoId,
                    cabideSN: moduloEditado.cabideSNSelecionado,
                }
            }

            const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/modulos/${modulos[index].id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(corpoRequisicaoComCabide)
            });

            if (!result.ok) {
                throw new Error('Erro ao atualizar módulo');
            }

            await result.json();

            // ========================================================================
            // AREA PARA MANIPULAÇÃO DE REGISTROS REFERENTE A ATUALIZAÇÃO DE MODULOS  
            // ========================================================================
            if (modulosEditaveis[index].OM_Atual_Id !== modulosEditaveis[index].omDestinoId) {
                const omAnterior = batalhoes.find(
                    b => String(b.id) === String(modulosEditaveis[index].OM_Atual_Id)
                )?.sigla || modulosEditaveis[index].OM_Atual;

                const omNova = batalhoes.find(
                    b => String(b.id) === String(modulosEditaveis[index].omDestinoId)
                )?.sigla || modulosEditaveis[index].omDestinoId;

                const acao = `TRANSFERÊNCIA DE OM: ${omAnterior} → ${omNova}`;

                await criarRegistroAutomatico({
                    materialId: null,
                    moduloId: modulos[index].id,
                    acao,
                    user
                });
            }
            // Cria registro automatico para mudança de DISPONIBILIDADE DO MODULO
            if (modulosEditaveis[index].Disponibilidade !== modulosEditaveis[index].disponibilidadeOriginal) {
                const dispAnterior = modulosEditaveis[index].disponibilidadeOriginal;
                const dispNova = modulosEditaveis[index].Disponibilidade;

                const acao = `ALTERAÇÃO DE DISPONIBILIDADE: ${dispAnterior} → ${dispNova}`;

                await criarRegistroAutomatico({
                    materialId: null,
                    moduloId: modulos[index].id,
                    acao,
                    user
                });
            }
            // Cria registro automatico para mudança de OBSERVAÇÃO
            if (modulosEditaveis[index].Obs !== modulosEditaveis[index].obsOriginal) {
                const obsAnterior = modulosEditaveis[index].obsOriginal;
                const obsNova = modulosEditaveis[index].Obs;

                const acao = `ALTERAÇÃO DE OBSERVAÇÃO: ${obsAnterior} → ${obsNova}`;

                await criarRegistroAutomatico({
                    materialId: null,
                    moduloId: modulos[index].id,
                    acao,
                    user
                });
            }
            // Cria registro automatico para mudança de CABIDE
            if (modulosEditaveis[index].cabideSNOriginal !== modulosEditaveis[index].cabideSNSelecionado) {
                const cabideAnterior = modulosEditaveis[index].cabideSNOriginal;
                const cabideNovo = modulosEditaveis[index].cabideSNSelecionado;

                const acao = `TRANSFERÊNCIA DE CABIDE: ${cabideAnterior} → ${cabideNovo}`;

                await criarRegistroAutomatico({
                    materialId: null,
                    moduloId: modulos[index].id,
                    acao,
                    user
                });
            }

            const novosModulos = [...modulos];
            const batalhaoOrigem = batalhoes.find(b => b.id === moduloEditado.omOrigemId);
            const batalhaoDestino = batalhoes.find(b => b.id === moduloEditado.omDestinoId);

            const cabideSelecionado = cabidesDisponiveis.find(cabide =>
                cabide.SN === moduloEditado.cabideSNSelecionado
            );

            novosModulos[index] = {
                ...novosModulos[index],
                Disponibilidade: moduloEditado.Disponibilidade,
                Obs: moduloEditado.Obs,
                OM_Origem_Id: moduloEditado.omOrigemId!,
                OM_Atual_Id: moduloEditado.omDestinoId!,
                OM_Origem: batalhaoOrigem?.sigla || novosModulos[index].OM_Origem,
                OM_Atual: batalhaoDestino?.sigla || novosModulos[index].OM_Atual,
                SN_do_Cabide: moduloEditado.cabideSNSelecionado || novosModulos[index].SN_do_Cabide,
                Disponibilidade_do_Cabide: cabideSelecionado?.Disponibilidade || novosModulos[index].Disponibilidade_do_Cabide
            };

            setModulos(novosModulos);
            setItens(novosModulos);

            const novosEditaveis = [...modulosEditaveis];
            novosEditaveis[index] = {
                ...novosEditaveis[index],
                editando: false,
                OM_Origem_Id: moduloEditado.omOrigemId!,
                OM_Atual_Id: moduloEditado.omDestinoId!,
                OM_Origem: batalhaoOrigem?.sigla || novosEditaveis[index].OM_Origem,
                OM_Atual: batalhaoDestino?.sigla || novosEditaveis[index].OM_Atual,
                SN_do_Cabide: moduloEditado.cabideSNSelecionado || novosEditaveis[index].SN_do_Cabide,
                Disponibilidade_do_Cabide: cabideSelecionado?.Disponibilidade || novosEditaveis[index].Disponibilidade_do_Cabide
            };
            setModulosEditaveis(novosEditaveis);

        } catch (error) {
            console.error("Erro ao atualizar módulo:", error);
            cancelarEdicao(index);
        }
    };

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

        const cabideSelecionado = cabidesDisponiveis.find(cabide => cabide.SN === novoSN);

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

            {modulosEditaveis.length > 0 ? (
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
                            {modulosPaginados.map((mod, idx) => {
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
                                                    {cabidesDisponiveis.map(cabide => (
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
                                                                            onClick: () =>
                                                                                setModal({ type: "novo", materialId: mod.id }),
                                                                        },
                                                                    ]
                                                                    : []),
                                                                {
                                                                    label: "Visualizar Registros",
                                                                    onClick: () =>
                                                                        setModal({ type: "listar", materialId: mod.id }),
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
                        Mostrando {modulosPaginados.length} de {modulosEditaveis.length} modulos
                    </div>

                    {/* Modais de exibição */}
                    <Modal
                        visible={modal.type === "novo"}
                        title="Criar Registro"
                        onClose={() => setModal({ type: null })}
                    >
                        <FormRegistro
                            moduloId={modal.materialId!}
                            materialId={null}
                            mecanicoId={user ? user.id : 0}
                            onSuccess={() => setModal({ type: null })}
                        />
                    </Modal>

                    <Modal
                        visible={modal.type === "listar"}
                        title="Registros do Material"
                        onClose={() => setModal({ type: null })}
                    >
                        <ListaRegistros itemId={modal.materialId!} isMaterial={false} />
                    </Modal>
                </>
            ) : (
                <p>Carregando módulos...</p>
            )}
        </div>
    )
}