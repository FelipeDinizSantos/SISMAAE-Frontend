import { Material } from "@/interfaces/Material.interface";
import { MaterialAPI, ModuloEditado } from "../interfaces";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from 'react-hot-toast';
import { Batalhao } from "@/interfaces/Batalhao.interface";
import { Modulo } from "@/interfaces/Modulo.interface";
import criarRegistroAutomatico from "@/lib/criarRegistroAutomatico";

export function useEdicaoModulos(
    modulos: Modulo[],
    setModulos: React.Dispatch<React.SetStateAction<Modulo[]>>,
    batalhoes: Batalhao[],
    user: any,
    setItens: Dispatch<SetStateAction<Material[] | Modulo[]>>,
    cabidesDisponiveis: MaterialAPI[]
) {
    const [modulosEditaveis, setModulosEditaveis] = useState<ModuloEditado[]>([]);

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

            const result = await fetch(`/api/modulos/${modulos[index].id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(corpoRequisicaoComCabide)
            });

            if (!result.ok) {
                throw new Error('Erro ao atualizar módulo');
            }

            await result.json();
            toast.success("Modulo editado");

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

        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("Ocorreu um erro inesperado!");
            }

            cancelarEdicao(index);
        }
    };

    return {
        modulosEditaveis,
        setModulosEditaveis,
        iniciarEdicao,
        cancelarEdicao,
        confirmarEdicao
    }
}