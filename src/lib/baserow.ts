import { Anexo } from "@/types/anexos";
import axios, { AxiosError } from "axios";

const BASEROW_API_URL = process.env.NEXT_PUBLIC_BASEROW_API_URL;
const BASEROW_TOKEN = process.env.NEXT_PUBLIC_BASEROW_TOKEN;
const ANEXOS_TABLE_ID = process.env.NEXT_PUBLIC_ANEXOS_TABLE_ID;

export const baserowApi = axios.create({
  baseURL: BASEROW_API_URL,
  headers: {
    Authorization: `Token ${BASEROW_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const getAnexosByProcessoId = async (processoId: number): Promise<Anexo[]> => {
  try {
    const response = await baserowApi.get(`/database/rows/table/${ANEXOS_TABLE_ID}/`, {
      params: {
        user_field_names: true,
        [`filter__processo_id__equal`]: processoId,
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Erro ao buscar anexos:', error);
    throw error;
  }
};

export const uploadAnexo = async (processoId: number, file: File): Promise<Anexo> => {
  try {
    // 1. Faz o upload do arquivo para o storage do Baserow
    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await axios.post(
      `${BASEROW_API_URL}/user-files/upload-file/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Token ${BASEROW_TOKEN}`
        }
      }
    );

    // 2. Extrai o nome do arquivo da URL
    const fileUrl = uploadResponse.data.url;
    const fileNameFromUrl = fileUrl.split('/').pop() || file.name;

    // 3. Prepara o payload com a estrutura exata que o Baserow espera
    const payload = {
      processo_id: processoId,
      nome_arquivo: file.name,
      anexo: [{
        url: fileUrl,
        name: fileNameFromUrl,  // Usa o nome do arquivo da URL
        size: file.size,
        mime_type: file.type,
        uploaded_at: new Date().toISOString()
      }],
      data_upload: new Date().toISOString()
    };

    // 4. Envia para a tabela do Baserow
    const recordResponse = await axios.post(
      `${BASEROW_API_URL}/database/rows/table/${ANEXOS_TABLE_ID}/?user_field_names=true`,
      payload,
      {
        headers: {
          'Authorization': `Token ${BASEROW_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return recordResponse.data;
    
  } catch (err: unknown) {
    const error = err as Error | AxiosError;
    const errorMessage = axios.isAxiosError(error)
      ? error.response?.data?.detail || error.message
      : error instanceof Error
        ? error.message
        : 'Erro desconhecido';

    console.error('Erro no upload:', errorMessage);
    throw new Error(`Falha ao enviar anexo: ${errorMessage}`);
  }
};

export const deleteAnexo = async (anexoId: number): Promise<void> => {
  try {
    await baserowApi.delete(`/database/rows/table/${ANEXOS_TABLE_ID}/${anexoId}/`);
  } catch (error) {
    console.error('Erro ao deletar anexo:', error);
    throw error;
  }
};

export const deleteAllAnexosByProcessoId = async (processoId: number): Promise<void> => {
  try {
    const anexos = await getAnexosByProcessoId(processoId);
    await Promise.all(anexos.map(anexo => deleteAnexo(anexo.id)));
  } catch (error) {
    console.error('Erro ao deletar anexos:', error);
    throw error;
  }
};