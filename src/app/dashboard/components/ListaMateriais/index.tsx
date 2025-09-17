import { Material } from "@/interfaces/Material.interface";
import "./ListaMateriais.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modulo } from "@/interfaces/Modulo.interface";

interface MaterialEditado extends Material {
    editando?: boolean;
    disponibilidadeOriginal?: string;
    obsOriginal?: string;
}

export default function ListaMateriais(
    {
        materiais,
        setMateriais,
        setItens
    }
        :
        {
            materiais: Material[],
            setMateriais: Dispatch<SetStateAction<Material[]>>,
            setItens: Dispatch<SetStateAction<Material[] | Modulo[]>>
        }
) {
    const [materiaisEditaveis, setMateriaisEditaveis] = useState<MaterialEditado[]>([]);

    useEffect(() => {
        setMateriaisEditaveis(materiais.map(mat => ({ ...mat })));
    }, [materiais]);

    const iniciarEdicao = (index: number) => {
        const novosMateriais = [...materiaisEditaveis];
        novosMateriais[index] = {
            ...novosMateriais[index],
            editando: true,
            disponibilidadeOriginal: novosMateriais[index].Disponibilidade,
            obsOriginal: novosMateriais[index].Obs
        };
        setMateriaisEditaveis(novosMateriais);
    };

    const cancelarEdicao = (index: number) => {
        const novosMateriais = [...materiaisEditaveis];
        novosMateriais[index] = {
            ...novosMateriais[index],
            editando: false,
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
        setItens(materiaisEditaveis => 
            materiaisEditaveis.map((mat, i) =>
                i === index ? materialSemPropriedadesEditaveis : mat
            )
        );

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/materiais/${materiais[index].id}`, {
                method: "PUT",
                headers: {
                    'Authorization': `Barear ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    disponibilidade: materiaisEditaveis[index].Disponibilidade,
                    observacao: materiaisEditaveis[index].Obs
                })
            });

            if (!result.ok) {
                throw new Error('Erro ao atualizar material');
            }

            const response = await result.json();
            console.log("Material atualizado com sucesso:", response);

        } catch (error) {
            console.error("Erro ao atualizar material:", error);
            cancelarEdicao(index);
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
            <h3>Lista de Materiais</h3>
            {materiaisEditaveis.length > 0 ? (
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
                        {materiaisEditaveis.map((mat, idx) => (
                            <tr key={idx}>
                                <td>{mat.Material}</td>
                                <td>{mat.SN}</td>
                                <td className={`status ${mat.Disponibilidade.toLowerCase()}`}>
                                    {mat.editando ? (
                                        <select
                                            value={mat.Disponibilidade}
                                            onChange={(e) => handleDisponibilidadeChange(
                                                idx,
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
                                <td>{mat.OM_Atual}</td>
                                <td>
                                    {mat.editando ? (
                                        <input
                                            type="text"
                                            value={mat.Obs}
                                            onChange={(e) => handleObsChange(idx, e.target.value)}
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
                                                onClick={() => confirmarEdicao(idx)}
                                                title="Confirmar edição"
                                            >
                                                ✓
                                            </button>
                                            <button
                                                className="btn-cancelar"
                                                onClick={() => cancelarEdicao(idx)}
                                                title="Cancelar edição"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn-editar"
                                            onClick={() => iniciarEdicao(idx)}
                                        >
                                            Editar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Carregando materiais...</p>
            )}
        </div>
    )
}