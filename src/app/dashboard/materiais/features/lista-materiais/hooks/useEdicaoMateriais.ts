import { Material } from "@/interfaces/Material.interface";
import { MaterialEditado } from "../interfaces";
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-hot-toast";
import { Batalhao } from "@/interfaces/Batalhao.interface";
import { Modulo } from "@/interfaces/Modulo.interface";
import criarRegistroAutomatico from "@/lib/criarRegistroAutomatico";

export function useEdicaoMateriais(
  materiais: Material[],
  setMateriais: React.Dispatch<React.SetStateAction<Material[]>>,
  batalhoes: Batalhao[],
  user: any,
  setItens: Dispatch<SetStateAction<Material[] | Modulo[]>>
) {
  const [materiaisEditaveis, setMateriaisEditaveis] = useState<
    MaterialEditado[]
  >([]);

  const iniciarEdicao = (index: number) => {
    const novosMateriais = materiaisEditaveis.map((mat, i) => {
      if (mat.editando && i !== index) {
        return {
          ...mat,
          editando: false,
          OM_Atual: mat.OM_Atual_Original || mat.OM_Atual,
          Disponibilidade: mat.disponibilidadeOriginal as
            | "DISPONIVEL"
            | "DISP_C_RESTRICAO"
            | "INDISPONIVEL"
            | "MANUTENCAO",
          Obs: mat.obsOriginal || mat.Obs,
        };
      }

      if (i === index) {
        return {
          ...mat,
          editando: true,
          OM_Atual_Original: mat.OM_Atual,
          disponibilidadeOriginal: mat.Disponibilidade,
          obsOriginal: mat.Obs,
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
      OM_Atual: novosMateriais[index].OM_Atual_Original || "",
      Disponibilidade: novosMateriais[index].disponibilidadeOriginal as
        | "DISPONIVEL"
        | "DISP_C_RESTRICAO"
        | "INDISPONIVEL"
        | "MANUTENCAO",
      Obs: novosMateriais[index].obsOriginal || "",
    };
    setMateriaisEditaveis(novosMateriais);
  };

  const confirmarEdicao = async (index: number) => {
    const novosMateriais = [...materiaisEditaveis];
    const materialEditado = {
      ...novosMateriais[index],
      editando: false,
    };

    novosMateriais[index] = materialEditado;
    setMateriaisEditaveis(novosMateriais);

    const {
      editando,
      disponibilidadeOriginal,
      obsOriginal,
      ...materialSemPropriedadesEditaveis
    } = materialEditado;

    setMateriais((prevMateriais) =>
      prevMateriais.map((mat, i) =>
        i === index ? materialSemPropriedadesEditaveis : mat
      )
    );

    try {
      const body: any = {
        status: materiaisEditaveis[index].Disponibilidade,
        obs: materiaisEditaveis[index].Obs,
      };

      let mudouOM = false;

      if (
        materiaisEditaveis[index].OM_Atual !==
        materiaisEditaveis[index].OM_Atual_Original
      ) {
        mudouOM = true;
        const novoLoc = batalhoes.find(
          (bat) => bat.id === parseInt(materiaisEditaveis[index].OM_Atual)
        )?.id;
        if (novoLoc) {
          body.loc_id = novoLoc;
        }
      }

      const result = await fetch(`/api/materiais/${materiais[index].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!result.ok) {
        const erro = await result.json();
        throw new Error(erro.erro || "Erro inesperado.");
      }

      await result.json();
      toast.success("Material editado");

      setItens((materiaisEditaveis) =>
        materiaisEditaveis.map((mat, i) =>
          i === index ? materialSemPropriedadesEditaveis : mat
        )
      );

      // ========================================================================
      // AREA PARA MANIPULAÇÃO DE REGISTROS REFERENTE A ATUALIZAÇÃO DE MATERIAIS
      // ========================================================================

      // Cria registro automatico para mudança da OM_ATUAL
      if (mudouOM) {
        const omAnterior =
          batalhoes.find(
            (b) =>
              String(b.id) ===
              String(materiaisEditaveis[index].OM_Atual_Original)
          )?.sigla || materiaisEditaveis[index].OM_Atual_Original;

        const omNova =
          batalhoes.find(
            (b) => String(b.id) === String(materiaisEditaveis[index].OM_Atual)
          )?.sigla || materiaisEditaveis[index].OM_Atual;

        const acao = `TRANSFERÊNCIA DE OM: ${omAnterior} → ${omNova}`;

        await criarRegistroAutomatico({
          materialId: materiais[index].id,
          moduloId: null,
          acao,
          user,
        });
      }
      // Cria registro automatico para mudança de DISPONIBILIDADE DO CABIDE
      if (
        materiaisEditaveis[index].Disponibilidade !==
        materiaisEditaveis[index].disponibilidadeOriginal
      ) {
        const dispAnterior = materiaisEditaveis[index].disponibilidadeOriginal;
        const dispNova = materiaisEditaveis[index].Disponibilidade;

        const acao = `ALTERAÇÃO DE DISPONIBILIDADE: ${dispAnterior} → ${dispNova}`;

        await criarRegistroAutomatico({
          materialId: materiais[index].id,
          moduloId: null,
          acao,
          user,
        });
      }
      // Cria registro automatico para mudança de OBSERVAÇÃO
      if (
        materiaisEditaveis[index].Obs !== materiaisEditaveis[index].obsOriginal
      ) {
        const obsAnterior = materiaisEditaveis[index].obsOriginal;
        const obsNova = materiaisEditaveis[index].Obs;

        const acao = `ALTERAÇÃO DE OBSERVAÇÃO: ${obsAnterior} → ${obsNova}`;

        await criarRegistroAutomatico({
          materialId: materiais[index].id,
          moduloId: null,
          acao,
          user,
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

  return {
    materiaisEditaveis,
    setMateriaisEditaveis,
    iniciarEdicao,
    cancelarEdicao,
    confirmarEdicao,
  };
}
