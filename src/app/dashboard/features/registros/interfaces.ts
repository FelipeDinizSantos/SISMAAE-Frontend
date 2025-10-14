export interface FormRegistroProps {
  materialId: number | null;
  moduloId: number | null;
  mecanicoId: number | null;
  onSuccess: () => void;
}

export interface Registro {
  id: number;
  cod: string; 
  acao: string;
  automatico: boolean;
  mecanico_id: number;
  mecanico_nome: string;
  mecanico_posto: string;
  mecanico_batalhao: string;
  perfil: string;
  data: string;
}

export interface ListaRegistrosProps {
  itemId: number;
  isMaterial: boolean;
}