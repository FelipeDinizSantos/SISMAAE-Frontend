export interface Relatorio {
  id: string;
  nome: string;
  descricao: string;
  componente: React.ReactNode;
  disponivelPara: string[];
}

export interface GraficoHistoricoDispProps {
  qtdRegistros: number;
  historico: {
    timestamp: string;
    status: {
      DISPONIVEL: number;
      DISP_C_RESTRICAO: number;
      INDISPONIVEL: number;
      MANUTENCAO: number;
    };
  }[];
}

export interface HistoricoItem {
  timestamp: string;
  status: {
    DISPONIVEL: number;
    DISP_C_RESTRICAO: number;
    INDISPONIVEL: number;
    MANUTENCAO: number;
  };
  total: number;
}