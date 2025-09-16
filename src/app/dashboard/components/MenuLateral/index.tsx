import GraficoStatus from "../GraficoStatus";
import "./MenuLateral.css";

interface Material {
    Material: string;
    SN: string;
    Disponibilidade: 'DISPONIVEL' | 'DISP_C_RESTRICAO' | 'INDISPONIVEL' | 'MANUTENCAO';
    OM_Origem: string;
    OM_Atual: string;
    Obs: string;
}

export default function MenuLateral({ materiais }: { materiais: Material[] }) {
    return (
        <section className="menu-lateral">
            <h3>Filtros de Busca</h3>

            <form>
                <label htmlFor="filtro">Filtrar por</label>
                <select id="filtro" name="filtro">
                    <option>Opção 1</option>
                    <option>Opção 2</option>
                    <option>Opção 3</option>
                </select>

                <label htmlFor="qual">Qual</label>
                <select id="qual" name="qual">
                    <option>Opção 1</option>
                    <option>Opção 2</option>
                    <option>Opção 3</option>
                </select>

                <button type="submit" className="voltar-inicio-btn">Voltar para o inicio</button>
            </form>


            <GraficoStatus materiais={materiais} />
        </section>
    )
}
