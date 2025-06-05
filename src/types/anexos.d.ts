export interface Anexo {
  id: number;
  processo_id: number;
  nome_arquivo: string;
  anexo: {
    url: string;
    name: string; // Tornado obrigatório (antes era opcional)
    size: number; // Tornado obrigatório
    mime_type?: string;
    is_image?: boolean;
    image_width?: number | null;
    image_height?: number | null;
    uploaded_at: string; // Tornado obrigatório
    thumbnails?: {
      tiny?: {
        url: string;
        width: number;
        height: number;
      };
      small?: {
        url: string;
        width: number;
        height: number;
      };
    };
  }[];
  data_upload: string;
  created_at?: string;
}

export interface ProcessoDetalhado {
  id: number;
  numeroProcesso: string;
  vara: string;
  classeTipo: string;
  assuntosTitulo: string;
  comarcaUF: string;
  status: string;
  nomeAutor: string;
  telefoneCliente: string;
  advogadoAutor: string;
  nomeReu: string;
  advogadoReu: string;
  advogadoId: number;
}