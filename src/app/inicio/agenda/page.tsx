'use client'

import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { FullCalendario } from "@/components/FullCalendario";
import { withAuth } from "@/utils/withAuth";
import router from "next/router";

interface AgendaTarefa {
  id: number;
  titulo: string;
  descricao: string;
  data: Date;
  advogadoId: number;
}

function Page() {

  // Criar Tarefa
  const [advogadoId, setAdvogadoId] = useState<string | null>(null)
  const [tarefas, setTarefas] = useState<AgendaTarefa[]>([]);
  const [novaTarefa, setNovaTarefa] = useState({
    titulo: "",
    descricao: "",
    data: new Date(),
    advogadoId: Number(advogadoId)
  });

  // Editar Tarefa
  const [tarefa, setTarefa] = useState<AgendaTarefa | null>(null);
  const [editarTitulo, setEditarTitulo] = useState(novaTarefa?.titulo || '');
  const [editarDescricao, setEditarDescricao] = useState(novaTarefa?.descricao || '');
  const [editarData, setEditarData] = useState(novaTarefa?.data || '');

  // Estado para abrir e fechar o modal de editar e excluir tarefa
  const [modalTarefa, setModalTarefa] = useState(false);

  // Verifica se o Advogado está logado
  const [authToken, setAuthToken] = useState<string | null>(null);
  
  useEffect(() => {
      const id = sessionStorage.getItem('advogadoId');
      const token = sessionStorage.getItem('authToken');
      
      if (id && token) {
          setAdvogadoId(id);
          setAuthToken(token);
      } else {
          toast.error("ID do advogado ou token não encontrados. Faça login novamente.", toastOptions);
          router.push('/login');
      }
  }, []);

  // Estado de carregar os conteúdos
  const [loading, setLoading] = useState(true);

  // Método 'GET' para visualizar as TAREFAS (nas devidas datas)
  useEffect(() => {
    const fetchTarefas = async () => {
      try {
        const response = await axios.get(
          `https://backendjuriscontrol.onrender.com/api/buscar-todas-tarefas/${advogadoId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setTarefas(response.data);
      } catch (error) {
        toast.error('Erro ao carregar as tarefas', toastOptions);
        console.error('Erro:', error);
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
        fetchTarefas();
    }
  }, [advogadoId, authToken])

  // Método 'POST' para adicionar uma TAREFA
  const handleAdicionarTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaTarefa.titulo.trim() || !novaTarefa.descricao.trim() || !novaTarefa.data) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    //console.log({...novaTarefa, advogadoId: Number(advogadoId)});
    console.log("Payload de nova tarefa:", {
      ...novaTarefa, // A data formatada
      advogadoId: Number(advogadoId)
    });
    console.log("Advogado ID no frontend:", advogadoId);
    console.log("Advogado ID (Number) no frontend:", Number(advogadoId));

    // Formata a data para o formato esperado pelo backend (LocalDateTime)
    //const dataFormatada = new Date(novaTarefa.data).toISOString().slice(0, 19);

    try {
      const tarefaParaEnviar = {
        titulo: novaTarefa.titulo,
        descricao: novaTarefa.descricao,
        data: novaTarefa.data,
        advogadoId: Number(advogadoId)
      };

      console.log("Payload sendo enviado ao backend:", tarefaParaEnviar);

      const response = await axios.post(
        `https://backendjuriscontrol.onrender.com/api/cadastrar-tarefa`,
        tarefaParaEnviar,
        { 
          headers: { 
            Authorization: `Bearer ${authToken}`, 
            'Content-Type': 'application/json' 
          } 
        }
      );

      // Atualiza a lista de tarefas
      setTarefas(prev => [response.data, ...prev]);

      // Reseta o formulário
      setNovaTarefa({
        titulo: "",
        descricao: "",
        data: new Date(),
        advogadoId: Number(advogadoId)
      });
      
      if (response.status === 200 || response.status === 201) {
        toast.success("Tarefa cadastrada com sucesso!", toastOptions);
      } else {
        const errorData = response.data;
        toast.error(`Erro ao cadastrar a tarefa: ${errorData?.message || 'Erro desconhecido'}`, toastOptions);
      }

    } catch (error: any) {
      console.error('Erro detalhado:', error.response?.data || error.message);
      toast.error("Erro ao cadastrar a tarefa", toastOptions);
    }
  };

  // Método 'PUT' para editar a tarefa
  const handleEditarTarefa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tarefa) return;

    // Formata a data para o formato esperado pelo backend (LocalDateTime)
    const dataFormatada = new Date(editarData);

    const data = {
      id: tarefa.id,
      titulo: editarTitulo,
      descricao: editarDescricao,
      data: dataFormatada,
      advogadoId: tarefa.advogadoId
    };

    try {
      const response = await axios.put(
        `https://backendjuriscontrol.onrender.com/api/atualizar-tarefa/${tarefa.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // const response = await axios.get<AgendaTarefa>(
      //   `https://backendjuriscontrol.onrender.com/api/buscar-tarefa/${tarefa.id}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${authToken}`,
      //       'Content-Type': 'application/json'
      //     }
      //   }
      // );

      toast.success("Tarefa editada com sucesso!", toastOptions);

      setTarefas(
        prev => prev.map(tarefa => tarefa.id === response.data.id ? response.data : tarefa)
      );

      setNovaTarefa({
        titulo: "",
        descricao: "",
        data: new Date(),
        advogadoId: Number()
      });

      setModalTarefa(false);
    } catch (error) {
      toast.error('Erro ao editar tarefa', toastOptions);
      console.error('Erro:', error);
    }
  }

  // Método 'DELETE' para excluir a tarefa
  const handleExcluirTarefa = async () => {
    try {
      await axios.delete(
        `https://backendjuriscontrol.onrender.com/api/deletar-tarefa/${tarefa?.id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setTarefas(prev => prev.filter(t => t.id !== tarefa?.id));

      toast.success("Tarefa excluida com sucesso!", toastOptions);
      setModalTarefa(false);
    } catch (error) {
      toast.error('Erro ao excluir a tarefa', toastOptions);
      console.error('Erro:', error);
    }
  }

  const toastOptions = {
      position: "top-center" as ToastPosition,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
  };

  return (
    <div className="flex flex-col">
      <NavBar
        botaoVoltar={
          <Link className="p-0 m-0 flex items-center" href="/inicio">
            <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
              <ChevronLeftIcon style={{ width: "35px", height: "35px" }} className=""></ChevronLeftIcon>
            </Button>
          </Link>
        }
        nome="Agenda"
      />

      <ToastContainer />

      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-2 mx-5 mt-1 mb-5">
        {/*Card Adicionar Tarefa*/}
        <Card className="w-full md:w-1/3 flex flex-col h-[610px]">
          <CardHeader className="bg-[#030430] text-white mb-5 rounded-t-lg">
            <CardTitle className="font-semibold">Adicionar Tarefa</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <form onSubmit={handleAdicionarTarefa}>
              <div className="flex flex-col gap-2 mb-4">
                <Label className="text-base">Título:</Label>
                <Input
                  type="text"
                  value={novaTarefa.titulo}
                  onChange={(e) => setNovaTarefa({ ...novaTarefa, titulo: e.target.value })}
                  placeholder="Insira o título."
                  className="border-gray-300 border-2"
                />
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <Label className="text-base">Data:</Label>
                <Input
                  type="date"
                  value={novaTarefa.data.toISOString().slice(0, 10)}
                  onChange={(e) => setNovaTarefa({ ...novaTarefa, data: new Date(e.target.value) })}
                  className="border-gray-300 border-2"
                />
              </div>

              <div className="flex flex-col flex-grow gap-2 mb-4">
                <Label className="text-base">Descrição:</Label>
                <Textarea
                  value={novaTarefa.descricao}
                  onChange={(e) => setNovaTarefa({ ...novaTarefa, descricao: e.target.value })}
                  placeholder="Insira sua descrição."
                  className="border-gray-300 border-2 w-full flex-grow"
                />
              </div>

              <div className="flex flex-row gap-2 justify-end">
                <Button
                  variant='outline'
                  type="button"
                  onClick={() => {
                    setNovaTarefa({
                      titulo: "",
                      descricao: "",
                      data: new Date(),
                      advogadoId: Number(advogadoId)
                    });
                  }}
                  className="border-gray-300 border-2 shadow-md"
                >
                  Limpar
                </Button>
                <Button type="submit" className="shadow-md">Salvar</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/*Card Calendário*/}
        <Card className="w-full md:w-2/3 h-[610px]">
          <CardHeader className="bg-[#030430] text-white mb-5 rounded-t-lg">
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: '100%'}}>
                <FullCalendario 
                  tarefas={tarefas} 
                  onSelectTarefa={(tarefaSelecionada) => {
                    setTarefa(tarefaSelecionada);
                    setEditarTitulo(tarefaSelecionada.titulo);
                    setEditarDescricao(tarefaSelecionada.descricao);
                    setEditarData(tarefaSelecionada.data);
                    setModalTarefa(false); // Abre o modal de edição
                  }}
                  // Passa os métodos "PUT" e "DELETE" com props
                  onEditarTarefa={handleEditarTarefa}
                  onExcluirTarefa={handleExcluirTarefa}

                  // Passa os valores atuais dos campos
                  setEditarTitulo={setEditarTitulo} 
                  setEditarDescricao={setEditarDescricao}
                  setEditarData={setEditarData}
                  setModalTarefa={setModalTarefa} // Passa o setter para o estado do modal
                />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(['advogado'])(Page);
