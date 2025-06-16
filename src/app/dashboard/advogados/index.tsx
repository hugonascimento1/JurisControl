'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext, PaginationEllipsis } from "@/components/ui/pagination";
import { Table, TableBody, TableCaption, TableHead, TableRow, TableHeader, TableFooter, TableCell } from "@/components/ui/table";
import { CirclePlus, Edit, Loader2, RefreshCcw, Search, Trash2 } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { withAuth } from "@/utils/withAuth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import axios, { AxiosError } from "axios";

import { useAdvogadosStore } from "@/store/advogadosStore";

const itemsPag = 6;

interface AdvogadoLista {
  id: number;
  nome: string;
  email: string;
  senha: string;
  registroOAB: string
}

function Page() {
  const router = useRouter();
  const [proxPag, setProxPag] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [administradorId, setAdministradoId] = useState<string | null>(null);
  const [authTokenAdm, setAuthTokenAdm] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  // Usar o estado e as ações do store do Zustand
  const advogados = useAdvogadosStore((state) => state.advogados);
  const lastFetched = useAdvogadosStore((state) => state.lastFetched);
  const setAdvogadosStore = useAdvogadosStore((state) => state.setAdvogados);

  // Estados para o formulário de novo advogado (modal de cadastro)
  const [novoAdvogadoNome, setNovoAdvogadoNome] = useState('');
  const [novoAdvogadoEmail, setNovoAdvogadoEmail] = useState('');
  const [novoAdvogadoSenha, setNovoAdvogadoSenha] = useState('');
  const [novoAdvogadoOAB, setNovoAdvogadoOAB] = useState('');
  const [cadastrarDialogOpen, setCadastrarDialogOpen] = useState(false);

  // Estados para o formulário de Edição de advogado (modal edição)
  const [editandoAdvogado, setEditandoAdvogado] = useState<AdvogadoLista | null>(null);
  const [editarAdvogadoData, setEditarAdvogadoData] = useState({
    nome: '',
    email: '',
    senha: '',
    registroOAB: ''
  });

  const [editarDialogOpen, setEditarDialogOpen] = useState(false);

  // Estados para o modal de Exclusão de advogado
  const [deletandoAdvogado, setDeletandoadvogado] = useState<AdvogadoLista | null>(null);
  const [deletarDialogOpen, setDeletarDialogOpen] = useState(false);


  const toastOptions = {
    position: "top-center" as ToastPosition,
    autoClose: 5000,
    hideProgessBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  }

  useEffect(() => {
    const id = sessionStorage.getItem('administradorId');
    const token = sessionStorage.getItem('authToken');
    if (id) {
      setAdministradoId(id);
    }
    if (token) {
      setAuthTokenAdm(token)
    }
  }, []);

  // Função para buscar os advogados, usando callback
  const fetchListaAdvogados = useCallback(async (force = false) => {
    if (!administradorId || !authTokenAdm) {
      console.warn('Id do administrador ou token não encontrados. Redirecionamento para login.');
      router.push('/login');
      return;
    }

    const cacheDuration = 10 * 60 * 1000;
    if (!force && advogados.length > 0 && lastFetched && (Date.now() - lastFetched < cacheDuration)) {
      console.log('Advogados carregados do cache do store.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<AdvogadoLista[]>(
        `https://backendjuriscontrol.onrender.com/api/buscar-todos-info-resumido-advogados`,
        {
          headers: {
            Authorization: `Bearer ${authTokenAdm}`,
          },
        }
      );

      setAdvogadosStore(response.data);
    } catch (error: any) {
      let errorMessage = 'Erro ao buscar advogados.';
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          errorMessage = 'Não foram encontrados advogoados'
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }
      setError(errorMessage);
      toast.error(errorMessage, toastOptions);
    } finally {
      setLoading(false);
    }
  }, [administradorId, authTokenAdm, router, advogados.length, lastFetched, setAdvogadosStore, toastOptions]);

  useEffect(() => {
    if (administradorId && authTokenAdm) {
      fetchListaAdvogados();
    }
  }, [administradorId, authTokenAdm, fetchListaAdvogados]);

  const handleRefreshClick = () => {
    fetchListaAdvogados(true); // Força a requisição, ignorando o cache
    setSearchTerm(''); // limpa o termo de busca ao atualizar
  };

  const handleOpenCadastrarDialog = () => {
    setNovoAdvogadoNome('');
    setNovoAdvogadoEmail('');
    setNovoAdvogadoSenha('');
    setNovoAdvogadoOAB('');
    setCadastrarDialogOpen(true);
  };

  const handleCadastrarAdvogado = async () => {
    if (!administradorId || !authTokenAdm) {
      toast.error('Credenciais de administrador não encontradas.', toastOptions);
      return;
    }

    if (!novoAdvogadoNome || !novoAdvogadoEmail || !novoAdvogadoSenha || !novoAdvogadoOAB) {
      toast.error('Por favor, preencha todos os campos para cadastrar o advogado', toastOptions);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `https://backendjuriscontrol.onrender.com/api/cadastrar-advogado`,
        {
          nome: novoAdvogadoNome,
          email: novoAdvogadoEmail,
          senha: novoAdvogadoSenha,
          registroOAB: novoAdvogadoOAB,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokenAdm}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        toast.success('Advogado cadastrado com sucesso!', toastOptions);


        setNovoAdvogadoNome('');
        setNovoAdvogadoEmail('');
        setNovoAdvogadoSenha('');
        setNovoAdvogadoOAB('');
        setCadastrarDialogOpen(false);
        fetchListaAdvogados(true);
      } else {
        toast.error('Erro ao cadastrar advogado.', toastOptions);
        setCadastrarDialogOpen(true);
      }
    } catch (error: any) {
      let errorMessage = 'Erro ao cadastrar advogado.';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  // Lógica para Editar advogado
  // Lógica para Editar advogado - Versão melhorada
  const handleOpenEditarDialog = (advogado: AdvogadoLista) => {
    setEditandoAdvogado(advogado);
    setEditarAdvogadoData({
      nome: advogado.nome,
      email: advogado.email,
      senha: '', // Sempre começa com senha vazia
      registroOAB: advogado.registroOAB
    });
    setEditarDialogOpen(true);
  };

  const handleEditarInputChange = (field: keyof typeof editarAdvogadoData, value: string) => {
    setEditarAdvogadoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateAdvogado = async () => {
    if (!administradorId || !authTokenAdm || !editandoAdvogado) {
      toast.error('Credenciais de administrador não encontradas.', toastOptions);
      return;
    }

    // Validações básicas
    if (!editarAdvogadoData.nome || !editarAdvogadoData.email || !editarAdvogadoData.registroOAB) {
      toast.error('Por favor, preencha todos os campos obrigatórios.', toastOptions);
      return;
    }

    if (editarAdvogadoData.senha && editarAdvogadoData.senha.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres.', toastOptions);
      return;
    }

    setLoading(true);
    try {
      // Cria o payload apenas com os campos que foram alterados
      const payload: Record<string, string> = {};

      if (editarAdvogadoData.nome !== editandoAdvogado.nome) {
        payload.nome = editarAdvogadoData.nome;
      }

      if (editarAdvogadoData.email !== editandoAdvogado.email) {
        payload.email = editarAdvogadoData.email;
      }

      if (editarAdvogadoData.registroOAB !== editandoAdvogado.registroOAB) {
        payload.registroOAB = editarAdvogadoData.registroOAB;
      }

      // Só inclui a senha se foi fornecida
      if (editarAdvogadoData.senha) {
        payload.senha = editarAdvogadoData.senha;
      }

      // Se não há nada para atualizar
      if (Object.keys(payload).length === 0) {
        toast.info('Nenhuma alteração foi feita.', toastOptions);
        return;
      }

      const response = await axios.patch(
        `https://backendjuriscontrol.onrender.com/api/atualiar-advogado-parcial/${editandoAdvogado.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authTokenAdm}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Advogado atualizado com sucesso!', toastOptions);
        setEditarDialogOpen(false);
        fetchListaAdvogados(true); // Atualiza a lista
      } else {
        toast.error('Erro ao atualizar advogado.', toastOptions);
      }
    } catch (error: any) {
      let errorMessage = 'Erro ao atualizar advogado.';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
        console.error('Detalhes do erro:', error.response?.data);
      }
      toast.error(errorMessage, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  // const handleUpdateAdvogado = async () => {
  //   if (!administradorId || !authTokenAdm) {
  //     toast.error('Credenciais de administrador não encontradas.', toastOptions);
  //     return;
  //   }

  //   if (!editandoAdvogado) return;

  //   // Validações básicas
  //   if (!editarAdvogadoNome || !editarAdvogadoEmail || !editarAdvogadoOAB) {
  //     toast.error('Por favor, preencha todos os campos obrigatórios.', toastOptions);
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const updates: Partial<{
  //       nome: string;
  //       email: string;
  //       senha?: string;
  //       registroOAB: string;
  //     }> = {
  //       nome: editarAdvogadoNome,
  //       email: editarAdvogadoEmail,
  //       registroOAB: editarAdvogadoOAB,
  //     };

  //     // Só inclui a senha se foi fornecida
  //     if (editarAdvogadoSenha) {
  //       if (editarAdvogadoSenha.length < 6) {
  //         toast.error('A senha deve ter no mínimo 6 caracteres.', toastOptions);
  //         return;
  //       }
  //       updates.senha = editarAdvogadoSenha;
  //     }

  //     const response = await axios.patch(
  //       `https://backendjuriscontrol.onrender.com/api/atualiar-advogado-parcial/${editandoAdvogado.id}`,
  //       updates,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${authTokenAdm}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       toast.success('Advogado atualizado com sucesso!', toastOptions);
  //       setEditarDialogOpen(false);
  //       setEditandoAdvogado(null);
  //       fetchListaAdvogados(true);
  //     } else {
  //       toast.error('Erro ao atualizar advogado.', toastOptions);
  //     }
  //   } catch (error: any) {
  //     let errorMessage = 'Erro ao atualizar advogado.';
  //     if (error instanceof AxiosError) {
  //       errorMessage = error.response?.data?.message || errorMessage;
  //     }
  //     toast.error(errorMessage, toastOptions);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Lógica para Excluir advogado
  const handleOpenDeletarDialog = (advogado: AdvogadoLista) => {
    setDeletandoadvogado(advogado);
    setDeletarDialogOpen(true);
  };

  const handleDeletaradvogado = async () => {
    if (!administradorId || !authTokenAdm) {
      toast.error('Credenciais de administrador não encontradas.', toastOptions);
      return;
    }
    if (!deletandoAdvogado) return;

    setLoading(true);
    try {
      const response = await axios.delete(
        `https://backendjuriscontrol.onrender.com/api/deletar-advogado/${deletandoAdvogado.id}`,
        {
          headers: {
            Authorization: `Bearer ${authTokenAdm}`,
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        toast.success('Advogado excluído com sucesso!', toastOptions);
        setDeletarDialogOpen(false);
        setDeletandoadvogado(null);
        fetchListaAdvogados(true);
      } else {
        toast.error('Erro ao excluir advogado.', toastOptions);
      }
    } catch (error: any) {
      let errorMessage = 'Erro ao excluir advogado.';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const filteredAdvogados = useMemo(() => {
    if (!searchTerm) {
      return advogados;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return advogados.filter(adv =>
      adv.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
      adv.email.toLowerCase().includes(lowerCaseSearchTerm) ||
      adv.registroOAB.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [advogados, searchTerm]);

  const totalPages = Math.ceil(filteredAdvogados.length / itemsPag);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setProxPag(page);
    }
  };

  const paginatedData = filteredAdvogados.slice(
    (proxPag - 1) * itemsPag,
    proxPag * itemsPag
  );

  return (
    <div className="flex flex-col h-full"> {/* Adicionado flex flex-col e h-full para ocupar o espaço vertical */}
      <ToastContainer />
      <div className="m-2 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4"> {/* Ajustado para empilhar em telas pequenas */}
        <div className="flex items-center space-x-2 w-full sm:w-auto"> {/* w-full para o input de busca em telas pequenas */}
          <Search className=" text-gray-500" />
          <Input
            className="w-full md:w-[400px]"
            placeholder={"Buscar Advogado"}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setProxPag(1);
            }}
          />
        </div>

        <div className="flex flex-row gap-3 mt-4 sm:mt-0"> {/* Adicionado margem superior em telas pequenas */}
          {/* Botão de atualizar tabela */}
          <Button variant='outline' onClick={handleRefreshClick} className="p-6 border-2">
            <RefreshCcw className="h-6 w-6 mx-auto text-gray-500" />
          </Button>

          <Dialog open={cadastrarDialogOpen} onOpenChange={setCadastrarDialogOpen}>
            <DialogTrigger asChild>
              <Button className=" bg-green-600 hover:bg-green-900 gap-2 p-6">
                Novo Advogado
                <CirclePlus className="text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent className="px-10">
              <DialogTitle className="text-center text-xl text-[#030430]">Cadastrar Advogado</DialogTitle>
              <div className="flex flex-col gap-2">
                <Label className="text-lg font-semibold text-[#030430]">Nome</Label>
                <Input
                  className=""
                  type="text"
                  name="advogadoNome"
                  placeholder="nome do advogado"
                  value={novoAdvogadoNome}
                  onChange={(e) => setNovoAdvogadoNome(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-lg font-semibold text-[#030430]">Email</Label>
                <Input
                  className=""
                  type="email"
                  name="advogadoEmail"
                  placeholder="email do advogado"
                  value={novoAdvogadoEmail}
                  onChange={(e) => setNovoAdvogadoEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-lg font-semibold text-[#030430]">Senha</Label>
                <Input
                  className=""
                  type="password"
                  name="advogadoSenha"
                  placeholder="senha para o advogado"
                  value={novoAdvogadoSenha}
                  onChange={(e) => setNovoAdvogadoSenha(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-lg font-semibold text-[#030430]">OAB</Label>
                <Input
                  className="t"
                  type="text"
                  name="advogadoOAB"
                  placeholder="oab do advogado"
                  value={novoAdvogadoOAB}
                  onChange={(e) => setNovoAdvogadoOAB(e.target.value)}
                />
              </div>
              <div className="flex flex-row gap-2 justify-end items-end">
                <Button variant="outline" className="w-24" onClick={() => setCadastrarDialogOpen(false)}>Cancelar</Button>
                <Button className="w-24" onClick={handleCadastrarAdvogado} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Salvar'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Card da Tabela */}
      <Card className="m-2 p-3 flex-1 overflow-auto"> {/* Adicionei flex-1 e overflow-auto */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Id</TableHead>
              <TableHead className="w-[300px]">Nome</TableHead>
              <TableHead>Email</TableHead>
              {/* <TableHead>Senha</TableHead> */}
              <TableHead>OAB</TableHead>
              <TableHead>Editar</TableHead>
              <TableHead>Excluir</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="animate-spin h-6 w-6 mx-auto text-gray-500" />
                  <p className="mt-2 text-gray-500">Carregando advogados...</p>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-red-500 py-8">
                  {error}
                </TableCell>
              </TableRow>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((advogado, index) => (
                <TableRow key={index} className="">
                  <TableCell className="">{advogado.id}</TableCell>
                  <TableCell className="">{advogado.nome}</TableCell>
                  <TableCell className="">{advogado.email}</TableCell>
                  {/* <TableCell className="">{advogado.senha}</TableCell> */}
                  <TableCell className="">{advogado.registroOAB}</TableCell>
                  <TableCell>
                    {/* Modal de Edição de Advogado */}
                    <Dialog open={editarDialogOpen && editandoAdvogado?.id === advogado.id} onOpenChange={setEditarDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => handleOpenEditarDialog(advogado)}>
                          <Edit className="text-gray-600" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="px-10">
                        <DialogTitle className="text-center text-[#030430] text-xl">Editar Advogado</DialogTitle>
                        <div className="flex flex-col gap-4">
                          <div>
                            <Label className="text-lg font-semibold text-[#030430]">Nome*</Label>
                            <Input
                              type="text"
                              value={editarAdvogadoData.nome}
                              onChange={(e) => handleEditarInputChange('nome', e.target.value)}
                              placeholder="Nome completo"
                              required
                            />
                          </div>

                          <div>
                            <Label className="text-lg font-semibold text-[#030430]">Email*</Label>
                            <Input
                              type="email"
                              value={editarAdvogadoData.email}
                              onChange={(e) => handleEditarInputChange('email', e.target.value)}
                              placeholder="Email válido"
                              required
                            />
                          </div>

                          <div>
                            <Label className="text-lg font-semibold text-[#030430]">Nova Senha</Label>
                            <Input
                              type="password"
                              value={editarAdvogadoData.senha}
                              onChange={(e) => handleEditarInputChange('senha', e.target.value)}
                              placeholder="Mínimo 6 caracteres"
                            />
                            <p className="text-sm text-gray-500 mt-1">Deixe em branco para manter a senha atual</p>
                          </div>

                          <div>
                            <Label className="text-lg font-semibold text-[#030430]">OAB*</Label>
                            <Input
                              type="text"
                              value={editarAdvogadoData.registroOAB}
                              onChange={(e) => handleEditarInputChange('registroOAB', e.target.value)}
                              placeholder="Número da OAB"
                              required
                            />
                          </div>

                          <div className="flex flex-row gap-2 justify-end mt-4">
                            <Button
                              variant="outline"
                              className="w-24"
                              onClick={() => setEditarDialogOpen(false)}
                              disabled={loading}
                            >
                              Cancelar
                            </Button>
                            <Button
                              className="w-24 bg-[#030430] hover:bg-[#030430]/90"
                              onClick={handleUpdateAdvogado}
                              disabled={loading}
                            >
                              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Salvar'}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    {/* Modal de Exclusão de Advogado */}
                    <Dialog open={deletarDialogOpen && deletandoAdvogado?.id === advogado.id} onOpenChange={setDeletarDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => handleOpenDeletarDialog(advogado)}>
                          <Trash2 className="text-gray-600" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle className="flex justify-center font-bold text-xl text-[#030430]">Excluir Advogado(a)</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <h1 className="text-center">Você tem certeza que quer excluir a conta do(a)</h1>
                          <strong className="text-[#030430] text-xl text-center">Dr.(a) {deletandoAdvogado?.nome}</strong>
                          <h1 className="text-center">do JurisControl</h1>
                        </div>
                        <DialogFooter className="flex flex-row gap-2 justify-end">
                          <Button variant="outline" className="" onClick={() => setDeletarDialogOpen(false)}>Cancelar</Button>
                          <Button type="submit" className="text-white bg-red-600 hover:bg-red-900" onClick={handleDeletaradvogado} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Excluir'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                  Nenhum advogado encontrado com o termo de busca.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Paginação */}
      <Pagination className="mb-7 mt-4"> {/* Adicionado margem superior para espaçamento */}
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(proxPag - 1)}
              className={
                proxPag === 1 || advogados.length === 0
                  ? "cursor-not-allowed text-gray-400"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, pageIndex) => (
            <PaginationItem key={pageIndex}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(pageIndex + 1)}
                className={proxPag === pageIndex + 1 ? "active" : ""}
              >
                {pageIndex + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => handlePageChange(proxPag + 1)}
              className={
                proxPag === totalPages || advogados.length === 0
                  ? "cursor-not-allowed text-gray-400"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default withAuth(['administrador'])(Page);
