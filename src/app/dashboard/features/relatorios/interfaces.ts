export interface Relatorio {
  id: string;
  nome: string;
  descricao: string;
  componente: React.ReactNode;
  disponivelPara: string[];
}