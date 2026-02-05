"use client";

import { useEffect, useState } from "react";
import styles from "./style.module.css";
import { Disponibilidade, Material, Modulo } from "./interfaces";
import Info from "./components/Info";
import { useBatalhao } from "@/hooks/useBatalhao";
import toast from "react-hot-toast";
import Input from "./components/Input";
import Select from "./components/Select";
import { MaterialAPI } from "@/interfaces/MaterialAPI.interface";
import capitalizar from "@/utils/capitalizar";
import { Batalhao } from "@/interfaces/Batalhao.interface";


export default function CadastroMaterial() {
    const [modo, setModo] = useState<"NOVO" | "EXISTENTE" | null>(null);

    const { batalhoes } = useBatalhao();
    const [materiaisArmazenados, setMateriaisArmazenados] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/materiais`, {
                    method: "GET",
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Erro ao criar registro");

                setMateriaisArmazenados(data.materiais);
            } catch (err: unknown) {
                console.log(err);

                if (err instanceof Error) toast.error(err.message);
                else toast.error("Ocorreu um erro inesperado!");
            }
        }

        fetchData();
    }, []);

    const [materiais, setMateriais] = useState<Material[]>([]);
    const [materialSelecionado, setMaterialSelecionado] = useState<Material | null>(null);

    const [materialSelecionadoSelect, setMaterialSelecionadoSelect] = useState(0);

    const [formMaterial, setFormMaterial] = useState({
        serial: "",
        tipo: "RADAR",
        disponibilidade: "DISPONIVEL" as Disponibilidade,
        omOrigem: 1,
        omAtual: 1,
    });

    const [formModulo, setFormModulo] = useState({
        serial: "",
        tipo: "",
        disponibilidade: "DISPONIVEL" as Disponibilidade,
        omOrigem: 1,
        omAtual: 1,
    });

    async function criarMaterial() {
        const payload = {
            serial_num: formMaterial.serial,
            nome: formMaterial.tipo,
            status: formMaterial.disponibilidade,
            origem_id: formMaterial.omOrigem,
            loc_id: formMaterial.omAtual
        }

        try {
            const res = await fetch(`/api/materiais`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erro ao criar registro");

            const novo: Material = {
                id: data.id,
                serial: data.serial_num,
                disponibilidade: data.status,
                modulos: [],
                omOrigem: data.origem_id,
                omAtual: data.loc_id,
                tipo: data.nome
            };

            console.log(novo);

            setMateriais((prev) => [...prev, novo]);
            setMaterialSelecionado(novo);

            toast.success("Material cadastrado!");
        } catch (err: unknown) {
            console.log(err);

            if (err instanceof Error) toast.error(err.message);
            else toast.error("Ocorreu um erro inesperado!");
        }
    }

    function cancelarCadastro() {
        setModo(null);
        setMaterialSelecionado(null);
        setMateriais([]);

        setFormMaterial({
            serial: "",
            tipo: "RADAR",
            disponibilidade: "DISPONIVEL",
            omOrigem: batalhoes[0]?.id ?? 1,
            omAtual: batalhoes[0]?.id ?? 1,
        });

        setFormModulo({
            serial: "",
            tipo: "",
            disponibilidade: "DISPONIVEL",
            omOrigem: batalhoes[0]?.id ?? 1,
            omAtual: batalhoes[0]?.id ?? 1,
        });
    }

    function finalizarAdicaoModulos() {
        setModo(null);
        setMaterialSelecionado(null);
        setMateriais([]);

        setFormMaterial({
            serial: "",
            tipo: "RADAR",
            disponibilidade: "DISPONIVEL",
            omOrigem: batalhoes[0]?.id ?? 1,
            omAtual: batalhoes[0]?.id ?? 1,
        });

        setFormModulo({
            serial: "",
            tipo: "",
            disponibilidade: "DISPONIVEL",
            omOrigem: batalhoes[0]?.id ?? 1,
            omAtual: batalhoes[0]?.id ?? 1,
        });
    }

    async function adicionarModulo() {
        if (!materialSelecionado) return;

        const payload = {
            serial_num: formModulo.serial,
            nome: formModulo.tipo,
            status: formModulo.disponibilidade,
            origem_id: formMaterial.omOrigem,
            loc_id: formMaterial.omAtual,
            pertence: materialSelecionado.tipo,
            material_id: materialSelecionado.id
        }

        try {
            const res = await fetch(`/api/modulos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erro ao criar registro");

            const modulo: Modulo = {
                id: data.id,
                serial: data.serial_num,
                disponibilidade: data.status,
                omOrigem: materialSelecionado.omOrigem,
                omAtual: materialSelecionado.omAtual,
                tipo: data.nome
            };

            const atualizado = materiais.map((mat) =>
                mat.id === materialSelecionado.id
                    ? { ...mat, modulos: [...mat.modulos, modulo] }
                    : mat
            );

            setMateriais(atualizado);

            const novoSelecionado = atualizado.find(
                (m) => m.id === materialSelecionado.id
            )!;
            setMaterialSelecionado(novoSelecionado);

            setFormModulo({
                serial: "",
                tipo: "",
                disponibilidade: "DISPONIVEL",
                omOrigem: data.origem_id,
                omAtual: data.loc_id,
            });

            toast.success("Modulo adicionado!");
        } catch (err: unknown) {
            console.log(err);

            if (err instanceof Error) toast.error(err.message);
            else toast.error("Ocorreu um erro inesperado!");
        }
    }

    async function selecionarMaterial() {
        let material: any = materiaisArmazenados.find((m: MaterialAPI) => m.id === materialSelecionadoSelect);
        let modulos;

        if (!material) {
            toast.error("Material não encontrado!");
            return;
        }

        try {
            const res = await fetch(`/api/modulos?cabide=${material.SN}`, {
                method: "GET",
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erro ao criar registro");

            modulos = data.modulos;
        } catch (err: unknown) {
            console.log(err);

            if (err instanceof Error) toast.error(err.message);
            else toast.error("Ocorreu um erro inesperado!");
        }

        let materialTicket = {
            id: material.id,
            serial: material.SN,
            tipo: material.Material,
            disponibilidade: material.Disponibilidade,
            omOrigem: material.OM_Origem,
            omAtual: material.OM_Atual,
            modulos
        }

        setFormMaterial({
            serial: materialTicket.serial,
            tipo: materialTicket.tipo,
            disponibilidade: materialTicket.disponibilidade,
            omAtual: batalhoes.find((b: Batalhao) => b.sigla === material.OM_Atual)!.id,
            omOrigem: batalhoes.find((b: Batalhao) => b.sigla === material.OM_Origem)!.id
        })
        setFormModulo({
            serial: "",
            tipo: "",
            disponibilidade: "DISPONIVEL",
            omOrigem: batalhoes.find((b: Batalhao) => b.sigla === material.OM_Atual)!.id,
            omAtual: batalhoes.find((b: Batalhao) => b.sigla === material.OM_Origem)!.id,
        })

        setMateriais((prev) => [...prev, materialTicket]);
        setMaterialSelecionado(materialTicket);
    }

    return (
        <div className={styles.layout}>
            {/* LADO ESQUERDO */}
            <div className={styles.container}>
                <div className={styles.titulo}>Cadastro</div>

                {!modo && (
                    <div className={styles.actions}>
                        <button
                            className={styles.botao}
                            onClick={() => setModo("NOVO")}
                        >
                            Novo Material
                        </button>

                        <button
                            className={styles.botao}
                            onClick={() => setModo("EXISTENTE")}
                        >
                            Adicionar módulo a material existente
                        </button>
                    </div>
                )}

                {/* BUSCAR MATERIAL */}
                {modo === "EXISTENTE" && !materialSelecionado && (
                    <>
                        <div className={styles.wrapper}>
                            <label
                                className={styles.label}
                            >
                                Selecione o material qual deseja adicionar novos módulos</label>
                            <select
                                className={styles.select}
                                value={materialSelecionadoSelect}
                                onChange={(e) => setMaterialSelecionadoSelect(Number(e.target.value))}
                            >
                                <option>Selecione</option>
                                {materiaisArmazenados.map((mat: MaterialAPI) => (
                                    <option key={mat.id} value={mat.id}>
                                        {mat.Material === "RADAR" ? capitalizar(mat.Material) : mat.Material} - {mat.SN} ({mat.OM_Origem})
                                    </option>
                                ))}
                            </select>
                            <button
                                className={`${styles.botao} ${styles.fullWidth}`}
                                onClick={selecionarMaterial}
                            >
                                Selecionar
                            </button>
                        </div>
                    </>
                )}

                {/* FORM MATERIAL */}
                {modo === "NOVO" && !materialSelecionado && (
                    <div className={styles.form}>
                        <Input
                            label="Número de Série"
                            value={formMaterial.serial}
                            maxLength={6}
                            onChange={(v: any) =>
                                setFormMaterial({ ...formMaterial, serial: v })
                            }
                        />

                        <Select
                            label="Tipo"
                            value={formMaterial.tipo}
                            options={["RADAR", "RBS70"]}
                            onChange={(v: any) =>
                                setFormMaterial({ ...formMaterial, tipo: v })
                            }
                        />

                        <Select
                            label="Disponibilidade"
                            value={formMaterial.disponibilidade}
                            options={[
                                "DISPONIVEL",
                                "DISP_C_RESTRICAO",
                                "INDISPONIVEL",
                                "MANUTENCAO",
                            ]}
                            onChange={(v: any) =>
                                setFormMaterial({
                                    ...formMaterial,
                                    disponibilidade: v as Disponibilidade,
                                })
                            }
                        />

                        <div className={styles.wrapper}>
                            <label
                                className={styles.label}
                            >OM Origem</label>
                            <select
                                className={styles.select}
                                value={formMaterial.omOrigem}
                                onChange={(e: any) =>
                                    setFormMaterial({
                                        ...formMaterial,
                                        omOrigem: Number(e.target.value)
                                    })
                                }
                            >
                                {batalhoes.map(b => (
                                    <option key={b.id} value={b.id}>
                                        {b.sigla}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.wrapper}>
                            <label
                                className={styles.label}
                            >OM Atual</label>
                            <select
                                className={styles.select}
                                value={formMaterial.omAtual}
                                onChange={(e: any) =>
                                    setFormMaterial({
                                        ...formMaterial,
                                        omAtual: Number(e.target.value)
                                    })
                                }
                            >
                                {batalhoes.map(b => (
                                    <option key={b.id} value={b.id}>
                                        {b.sigla}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <button
                            className={`${styles.botao} ${styles.fullWidth}`}
                            onClick={criarMaterial}
                        >
                            Criar Material
                        </button>

                        <button
                            className={`${styles.botao} ${styles.botaoCancelar} ${styles.fullWidth}`}
                            onClick={cancelarCadastro}
                        >
                            Cancelar Cadastro
                        </button>
                    </div>
                )}

                {/* FORM MODULO */}
                {materialSelecionado && (
                    <>
                        <div className={styles.subTitulo}>
                            Adicionar módulo
                        </div>

                        <div className={styles.form}>
                            <Input
                                label="Número de Serie"
                                value={formModulo.serial}
                                onChange={(v: any) =>
                                    setFormModulo({ ...formModulo, serial: v })
                                }
                            />
                            <Input
                                label="Nome"
                                value={formModulo.tipo}
                                onChange={(v: any) =>
                                    setFormModulo({ ...formModulo, tipo: v })
                                }
                            />

                            <Select
                                label="Disponibilidade"
                                value={formModulo.disponibilidade}
                                options={[
                                    "DISPONIVEL",
                                    "DISP_C_RESTRICAO",
                                    "INDISPONIVEL",
                                    "MANUTENCAO",
                                ]}
                                onChange={(v: any) =>
                                    setFormModulo({
                                        ...formModulo,
                                        disponibilidade: v as Disponibilidade,
                                    })
                                }
                            />

                            <div className={styles.wrapper}>
                                <label
                                    className={styles.label}
                                >OM Origem</label>
                                <select
                                    className={styles.select}
                                    value={formMaterial.omOrigem || batalhoes.find(b => b.id === formMaterial.omOrigem)?.sigla}
                                    disabled
                                    onChange={(v: any) =>
                                        setFormModulo({ ...formModulo, omOrigem: v.target.value })
                                    }
                                >
                                    {batalhoes.map(b => (
                                        <option key={b.id} value={b.id}>
                                            {b.sigla}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.wrapper}>
                                <label
                                    className={styles.label}
                                >OM Atual</label>
                                <select
                                    className={styles.select}
                                    value={formMaterial.omAtual || batalhoes.find(b => b.id === formMaterial.omOrigem)?.sigla}
                                    disabled
                                    onChange={(v: any) =>
                                        setFormModulo({ ...formModulo, omAtual: v.target.value })
                                    }
                                >
                                    {batalhoes.map(b => (
                                        <option key={b.id} value={b.id}>
                                            {b.sigla}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <button
                                className={`${styles.botao} ${styles.botaoSecundario} ${styles.fullWidth}`}
                                onClick={adicionarModulo}
                            >
                                Adicionar ao Material
                            </button>

                            <button
                                className={`${styles.botao} ${styles.fullWidth}`}
                                onClick={finalizarAdicaoModulos}
                            >
                                Finalizar
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* LADO DIREITO - TICKETS */}
            <div className={styles.ticketsArea}>
                {materiais.map((mat: any) => (
                    <div
                        key={mat.id}
                        className={`${styles.cardMaterial} ${materialSelecionado?.id === mat.id
                            ? styles.cardSelecionado
                            : ""
                            }`}
                        onClick={() => setMaterialSelecionado(mat)}
                    >
                        <div className={styles.cardHeader}>
                            <div>
                                <div className={styles.cardTitulo}>
                                    {mat.tipo}
                                </div>
                                <div className={styles.cardSub}>
                                    SN {mat.serial}
                                </div>
                            </div>

                            <span
                                className={`${styles.badge} ${styles[mat.disponibilidade]}`}
                            >
                                {mat.disponibilidade}
                            </span>
                        </div>

                        <div className={styles.cardInfoGrid}>
                            <Info label="OM Origem" value={batalhoes.find(b => b.id === mat.omOrigem)?.sigla || mat.OM_Origem || mat.omOrigem} />
                            <Info label="OM Atual" value={batalhoes.find(b => b.id === mat.omAtual)?.sigla || mat.OM_Atual || mat.omAtual} />
                            <Info label="Qtd. Módulos" value={mat.modulos.length} />
                        </div>

                        {/* MODULOS */}
                        {mat.modulos.length > 0 && (
                            <div className={styles.modulosContainer}>
                                {mat.modulos.map((mod: any) => (
                                    <div key={mod.id} className={styles.cardModulo}>
                                        <div className={styles.cardModuloHeader}>
                                            <div>
                                                <strong>{mod.tipo || mod.modulo}</strong>
                                                <div className={styles.cardSub}>
                                                    SN {mod.serial || mod.SN}
                                                </div>
                                            </div>

                                            <span
                                                className={`${styles.badge} ${styles[mod.disponibilidade || mod.Disponibilidade]}`}
                                            >
                                                {mod.disponibilidade || mod.Disponibilidade}
                                            </span>
                                        </div>

                                        <div className={styles.cardInfoGrid}>
                                            <Info label="OM Origem" value={batalhoes.find(b => b.id === mod.omOrigem)?.sigla || mat.omOrigem || mod.OM_Origem} />
                                            <Info label="OM Atual" value={batalhoes.find(b => b.id === mod.omAtual)?.sigla || mat.omAtual || mod.OM_Atual} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}