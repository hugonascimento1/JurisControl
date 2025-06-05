// components/AnexosCard.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast, ToastContainer, ToastPosition } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getAnexosByProcessoId, uploadAnexo, deleteAnexo, deleteAllAnexosByProcessoId } from '@/lib/baserow';
import { Anexo } from '@/types/anexos';
import { forwardRef, useImperativeHandle } from 'react';

interface AnexosCardProps {
  processoId: number;
  onDeleteProcesso: () => Promise<void>;
}


export function AnexosCard({ processoId, onDeleteProcesso }: AnexosCardProps) {
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toastOptions = {
    position: "top-center" as ToastPosition,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }

  useEffect(() => {
    loadAnexos();
  }, [processoId]);

  const loadAnexos = async () => {
    try {
      setLoading(true);
      const data = await getAnexosByProcessoId(processoId);
      setAnexos(data);
    } catch (error) {
      toast.error('Erro ao carregar anexos', toastOptions);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para obter a data de um anexo
  const getDataAnexo = (anexo: Anexo): string | undefined => {
    if (anexo.data_upload) return anexo.data_upload;
    if (anexo.created_at) return anexo.created_at;
    if (anexo.anexo[0]?.uploaded_at) return anexo.anexo[0].uploaded_at;
    return undefined;
  };

  // Função de formatação de data que aceita string | undefined
  const formatarData = (dataString: string | undefined | null): string => {
    if (!dataString) return 'Data não disponível';
    
    try {
      const data = new Date(dataString);
      return isNaN(data.getTime()) 
        ? 'Data inválida' 
        : data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
    } catch {
      return 'Data inválida';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validações
    if (file.size > 3 * 1024 * 1024) {
      toast.error('O arquivo deve ter no máximo 3MB', toastOptions);
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são permitidos', toastOptions);
      return;
    }

    try {
      setUploading(true);
      await uploadAnexo(processoId, file);
      toast.success('Anexo adicionado com sucesso', toastOptions);
      await loadAnexos();
    } catch (error) {
      // Tratamento detalhado de erro
      let errorMessage = 'Erro ao enviar anexo';
      
      // Verifica se é um erro do Axios
    //   if (error.isAxiosError) {
    //     if (error.response) {
    //       // O servidor respondeu com um status fora do range 2xx
    //       errorMessage = error.response.data?.error || 
    //                     error.response.data?.message || 
    //                     `Erro no servidor: ${error.response.status}`;
    //     } else if (error.request) {
    //       // A requisição foi feita mas não houve resposta
    //       errorMessage = 'Sem resposta do servidor. Verifique sua conexão.';
    //     } else {
    //       // Algum erro ocorreu durante a configuração da requisição
    //       errorMessage = error.message || 'Erro ao configurar a requisição';
    //     }
    //   } else if (error instanceof Error) {
    //     // Erro genérico
    //     errorMessage = error.message;
    //   }
      
      toast.error(errorMessage, toastOptions);
      console.error('Detalhes do erro:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAnexo = async (anexoId: number) => {
    try {
      await deleteAnexo(anexoId);
      toast.success('Anexo removido com sucesso', toastOptions);
      await loadAnexos();
    } catch (error) {
      toast.error('Erro ao remover anexo', toastOptions);
      console.error(error);
    }
  };

  const handleDeleteProcessoWithAnexos = async () => {
    try {
      await deleteAllAnexosByProcessoId(processoId);
      await onDeleteProcesso();
    } catch (error) {
      toast.error('Erro ao excluir processo e anexos', toastOptions);
      console.error(error);
    }
  };

  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="bg-[#030430] !space-y-0 justify-between items-center h-14 rounded-t-lg text-white flex flex-row">
        <CardTitle className="text-lg">Documentos Anexados</CardTitle>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
            disabled={uploading}
          />
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent text-white border-2 hover:bg-gray-100 text-sm flex items-center gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4 md:hidden" />
                <span className='hidden md:block'>Adicionar Anexo</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : anexos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum documento anexado
          </div>
        ) : (
          <div className="space-y-4">
            {anexos.map((anexo) => (
              <div key={anexo.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-500" />
                  <div>
                    <p className="font-medium">{anexo.nome_arquivo || 'Documento sem nome'}</p>
                    <p className="text-sm text-gray-500">
                      {formatarData(getDataAnexo(anexo))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(anexo.anexo[0]?.url, '_blank')}
                    disabled={!anexo.anexo[0]?.url}
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDeleteAnexo(anexo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {/* <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="destructive" 
            className="mt-4 mx-4 mb-4"
          >
            Excluir Processo
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este processo e todos os seus anexos?
          </DialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline">Cancelar</Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteProcessoWithAnexos}
            >
              Confirmar Exclusão
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}
    </Card>
  );
}