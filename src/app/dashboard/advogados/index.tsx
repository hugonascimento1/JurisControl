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
  const [editarAdvogadoNome, setEditaradvogadoNome] = useState('');
  const [editarAdvogadoEmail, setEditaradvogadoEmail] = useState('');
  const [editarAdvogadoSenha, setEditaradvogadoSenha] = useState('');
  const [editarAdvogadoOAB, setEditaradvogadoOAB] = useState('');
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
  const handleOpenEditarDialog = (advogado: AdvogadoLista) => {
    setEditandoAdvogado(advogado);
    setEditaradvogadoNome(advogado.nome);
    setEditaradvogadoEmail(advogado.email);
    setEditaradvogadoSenha(advogado.senha);
    setEditaradvogadoOAB(advogado.registroOAB);
    setEditarDialogOpen(true);
  };

  const handleUpdateAdvogado = async () => {
    if (!administradorId || !authTokenAdm) {
      toast.error('Credenciais de administrador não encontradas.', toastOptions);
      return;
    }

    if (!editandoAdvogado) return; //não há advogado para editar

    if (!editarAdvogadoNome || !editarAdvogadoEmail || !editarAdvogadoSenha || !editarAdvogadoOAB) {
      toast.error('Por favor, preencha todos os campos para atualizar o advogado');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `https://backendjuriscontrol.onrender.com/api/atualizar-advogado/${editandoAdvogado.id}`,
        {
          nome: editarAdvogadoNome,
          email: editarAdvogadoEmail,
          senha: editarAdvogadoSenha,
          registroOAB: editarAdvogadoOAB,
        },
        {
          headers: {
            Authorization: `Bearer ${authTokenAdm}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Advogado atualizado com sucesso!', toastOptions);
        setEditarDialogOpen(false);
        setEditandoAdvogado(null);
        fetchListaAdvogados(true);
      } else {
        toast.error('Erro ao atualizar advogado.', toastOptions);
      }
    } catch (error: any) {
      let errorMessage = 'Erro ao atualizar advogado.';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage, toastOptions);
    } finally {
      setLoading(false);
    }
  }

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
    <div>
      {/* <NavBar nome={"Advogados"}  botaoVoltar /> */}

      <div className="m-2">
        <ToastContainer />
        <div className="m-2 mb-6 flex justify-between">
          <div className="flex items-center space-x-2">
            <Search className=" text-gray-500" />
            <Input
              className=" md:w-[400px]"
              placeholder={"Buscar Advogado"}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setProxPag(1);
              }}
            />
          </div>

          <div className="flex flex-row gap-3">
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

        <Card className="m-2 p-3">
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
                          <DialogTitle className="text-center text-[#030430] text-xl">Editar Informações do advogado</DialogTitle>
                          <div className="flex flex-col gap-2">
                            <Label className="text-lg font-semibold text-[#030430]">Nome</Label>
                            <Input
                              className=""
                              type="text"
                              name="advogadoNome"
                              value={editarAdvogadoNome}
                              onChange={(e) => setEditaradvogadoNome(e.target.value)}
                              placeholder="nome do advogado"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Label className="text-lg font-semibold text-[#030430]">Email</Label>
                            <Input
                              className=""
                              type="email"
                              name="advogadoEmail"
                              value={editarAdvogadoEmail}
                              onChange={(e) => setEditaradvogadoEmail(e.target.value)}
                              placeholder="email do advogado"
                            />
                          </div>
                          {/* <div className="flex flex-col gap-2">
                            <Label className="text-lg font-semibold text-[#030430]">Senha</Label>
                            <Input
                              className=""
                              type="text"
                              name="advogadoSenha"
                              value={editarAdvogadoSenha}
                              onChange={(e) => setEditaradvogadoSenha(e.target.value)}
                              placeholder="senha para o advogado"
                            />
                          </div> */}
                          <div className="flex flex-col gap-2">
                            <Label className="text-lg font-semibold text-[#030430]">OAB</Label>
                            <Input
                              className="t"
                              type="text"
                              name="advogadoOAB"
                              value={editarAdvogadoOAB}
                              onChange={(e) => setEditaradvogadoOAB(e.target.value)}
                              placeholder="oab do advogado"
                            />
                          </div>
                          <div className="flex flex-row gap-2 justify-end items-end">
                            <Button variant="outline" className="w-24" onClick={() => setEditarDialogOpen(false)}>Cancelar</Button>
                            <Button className="w-24" onClick={handleUpdateAdvogado} disabled={loading}>
                              {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Editar'}
                            </Button>
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
        <Pagination className="mb-7">
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
    </div>
  );
}

export default withAuth(['administrador'])(Page);
