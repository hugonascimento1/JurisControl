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
import { toast, ToastPosition } from "react-toastify";
import axios, { AxiosError } from "axios";

import { useAdministradoresStore } from "@/store/administradoresStore";

const itemsPag = 6;

interface AdministradorLista {
    id: number;
    nome: string;
    email: string;
    senha: string;
    cnpj: string;
    telefone: string;
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
    const administradores = useAdministradoresStore((state) => state.administradores);
    const lastFetched = useAdministradoresStore((state) => state.lastFetched);
    const setAdministradoresStore = useAdministradoresStore((state) => state.setAdministradores);

    // Estados para o formulário de novo administrador (modal de cadastro)
    const [novoAdmNome, setNovoAdmNome] = useState('');
    const [novoAdmEmail, setNovoAdmEmail] = useState('');
    const [novoAdmSenha, setNovoAdmSenha] = useState('');
    const [novoAdmCnpj, setNovoAdmCnpj] = useState('');
    const [novoAdmTelefone, setNovoAdmTelefone] = useState('');
    const [cadastrarAdmDialogOpen, setCadastrarAdmDialogOpen] = useState(false);

    // Estados para o formulário de Edição de administrador (modal edição)
    const [editandoAdm, setEditandoAdm] = useState<AdministradorLista | null>(null);
    const [editarAdmNome, setEditarAdmNome] = useState('');
    const [editarAdmEmail, setEditarAdmEmail] = useState('');
    const [editarAdmSenha, setEditarAdmSenha] = useState('');
    const [editarAdmCnpj, setEditarAdmCnpj] = useState('');
    const [editarAdmTelefone, setEditarAdmTelefone] = useState('');
    const [editarAdmDialogOpen, setEditarAdmDialogOpen] = useState(false);

    // Estados para o modal de Exclusão de advogado
    const [deletandoAdm, setDeletandoAdm] = useState<AdministradorLista | null>(null);
    const [deletarAdmDialogOpen, setDeletarAdmDialogOpen] = useState(false);

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

    // Função para buscar os administradores, usando callback
    const fetchListaAdministradores = useCallback(async (force = false) => {
        if (!administradorId || !authTokenAdm) {
            console.warn('Id do administrador ou token não encontrados. Redirecionamento para login.');
            router.push('/login');
            return;
        }

        const cacheDuration = 10 * 60 * 1000;
        if (!force && administradores.length > 0 && lastFetched && (Date.now() - lastFetched < cacheDuration)) {
            console.log('Advogados carregados do cache do store.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get<AdministradorLista[]>(
                `https://backendjuriscontrol.onrender.com/api/buscar-todos-administradores`,
                {
                    headers: {
                        Authorization: `Bearer ${authTokenAdm}`,
                    },
                }
            );

            setAdministradoresStore(response.data);
        } catch (error: any) {
            let errorMessage = 'Erro ao buscar administradores.';
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    errorMessage = 'Não foram encontrados administradores'
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
            }
            setError(errorMessage);
            toast.error(errorMessage, toastOptions);
        } finally {
            setLoading(false);
        }
    }, [administradorId, authTokenAdm, router, administradores.length, lastFetched, setAdministradoresStore, toastOptions]);

    useEffect(() => {
        if (administradorId && authTokenAdm) {
            fetchListaAdministradores();
        }
    }, [administradorId, authTokenAdm, fetchListaAdministradores]);

    const handleRefreshClick = () => {
        fetchListaAdministradores(true); // Força a requisição, ignorando o cache
        setSearchTerm('');
    };

    // Lógica para cadastrar novo administrador
    const handleOpenCadastrarAdmDialog = () => {
        setNovoAdmNome('');
        setNovoAdmEmail('');
        setNovoAdmSenha('');
        setNovoAdmCnpj('');
        setNovoAdmTelefone('');
        setCadastrarAdmDialogOpen(true);
    };

    const handleCadastrarAdm = async () => {
        if (!administradorId || !authTokenAdm) {
            toast.error('Credenciais de administrador não encontradas.', toastOptions);
            return;
        }

        if (!novoAdmNome || !novoAdmEmail || !novoAdmSenha || !novoAdmCnpj || !novoAdmTelefone) {
            toast.error('Por favor, preencha todos os campos para cadastrar o administrador', toastOptions);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `https://backendjuriscontrol.onrender.com/api/cadastrar-administrador`,
                {
                    nome: novoAdmNome,
                    email: novoAdmEmail,
                    senha: novoAdmSenha,
                    cnpj: novoAdmCnpj,
                    telefone: novoAdmTelefone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authTokenAdm}`,
                    },
                }
            );

            if (response.status === 201 || response.status === 200) {
                toast.success('Administrador cadastrado com sucesso!', toastOptions);
                setCadastrarAdmDialogOpen(false);
                fetchListaAdministradores(true);
            } else {
                toast.error('Erro ao cadastrar administrador.', toastOptions);
            }
        } catch (error: any) {
            let errorMessage = 'Erro ao cadastrar administrador.';
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            toast.error(errorMessage, toastOptions);
        } finally {
            setLoading(false);
        }
    };

    // Lógica para Editar advogado
    const handleOpenEditarAdmDialog = (administrador: AdministradorLista) => {
        setEditandoAdm(administrador);
        setEditarAdmNome(administrador.nome);
        setEditarAdmEmail(administrador.email);
        setEditarAdmSenha(administrador.senha);
        setEditarAdmCnpj(administrador.cnpj);
        setEditarAdmTelefone(administrador.telefone);
        setEditarAdmDialogOpen(true);
    };

    const handleUpdateAdministrador = async () => {
        if (!administradorId || !authTokenAdm) {
            toast.error('Credenciais de administrador não encontradas.', toastOptions);
            return;
        }

        if (!editandoAdm) return; //não há advogado para editar

        if (!editarAdmNome || !editarAdmEmail || !editarAdmSenha || !editarAdmCnpj || !editarAdmTelefone) {
            toast.error('Por favor, preencha todos os campos para atualizar o administrador');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(
                `https://backendjuriscontrol.onrender.com/api/atualizar-administrador/${editandoAdm.id}`,
                {
                    nome: editarAdmNome,
                    email: editarAdmEmail,
                    senha: editarAdmSenha,
                    cnpj: editarAdmCnpj,
                    telefone: editarAdmTelefone,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authTokenAdm}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Administrador atualizado com sucesso!', toastOptions);
                setEditarAdmDialogOpen(false);
                setEditandoAdm(null);
                fetchListaAdministradores(true);
            } else {
                toast.error('Erro ao atualizar administrador.', toastOptions);
            }
        } catch (error: any) {
            let errorMessage = 'Erro ao atualizar administrador.';
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            toast.error(errorMessage, toastOptions);
        } finally {
            setLoading(false);
        }
    }

    // Lógica para Excluir administrador
    const handleOpenDeletarAdmDialog = (administrador: AdministradorLista) => {
        setDeletandoAdm(administrador);
        setDeletarAdmDialogOpen(true);
    };

    const handleDeletarAdministrador = async () => {
        if (!administradorId || !authTokenAdm) {
            toast.error('Credenciais de administrador não encontradas.', toastOptions);
            return;
        }
        if (!deletandoAdm) return;

        setLoading(true);
        try {
            const response = await axios.delete(
                `https://backendjuriscontrol.onrender.com/api/deletar-administrador/${deletandoAdm.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authTokenAdm}`,
                    },
                }
            );

            if (response.status === 200 || response.status === 204) {
                toast.success('Administrador excluído com sucesso!', toastOptions);
                setDeletarAdmDialogOpen(false);
                setDeletandoAdm(null);
                fetchListaAdministradores(true);
            } else {
                toast.error('Erro ao excluir Administrador.', toastOptions);
            }
        } catch (error: any) {
            let errorMessage = 'Erro ao excluir administrador.';
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            toast.error(errorMessage, toastOptions);
        } finally {
            setLoading(false);
        }
    };

    const filteredAdministradores = useMemo(() => {
        if (!searchTerm) {
            return administradores;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return administradores.filter(adm => 
            adm.nome.toLowerCase().includes(lowerCaseSearchTerm) ||
            adm.email.toLowerCase().includes(lowerCaseSearchTerm) ||
            adm.cnpj.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [administradores, searchTerm]);

    const totalPages = Math.ceil(filteredAdministradores.length / itemsPag);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setProxPag(page);
        }
    };

    const paginatedData = filteredAdministradores.slice(
        (proxPag - 1) * itemsPag,
        proxPag * itemsPag
    );

    return (
        <div>
            {/* <NavBar nome={"Advogados"}  botaoVoltar /> */}

            <div className="mt-2">
                <div className="m-2 mb-6 flex justify-between">
                    <div className="flex items-center space-x-2">
                        <Search className=" text-gray-500" />
                        <Input
                            className=" md:w-[400px]"
                            placeholder={"Buscar Administrador"}
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

                        <Dialog open={cadastrarAdmDialogOpen} onOpenChange={setCadastrarAdmDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className=" bg-green-600 hover:bg-green-900 gap-2 p-6">
                                    Novo Administrador
                                    <CirclePlus className="text-white" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="px-10">
                                <DialogTitle className="text-center text-xl text-[#030430]">Cadastrar Administrador</DialogTitle>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-lg font-semibold text-[#030430]">Nome</Label>
                                    <Input
                                        className=""
                                        type="text"
                                        name="admNome"
                                        placeholder="nome do adm"
                                        value={novoAdmNome}
                                        onChange={(e) => setNovoAdmNome(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-lg font-semibold text-[#030430]">Email</Label>
                                    <Input
                                        className=""
                                        type="email"
                                        name="admEmail"
                                        placeholder="email do adm"
                                        value={novoAdmEmail}
                                        onChange={(e) => setNovoAdmEmail(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-lg font-semibold text-[#030430]">Senha</Label>
                                    <Input
                                        className=""
                                        type="password"
                                        name="admSenha"
                                        placeholder="senha para o adm"
                                        value={novoAdmSenha}
                                        onChange={(e) => setNovoAdmSenha(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-lg font-semibold text-[#030430]">CNPJ</Label>
                                    <Input
                                        className=""
                                        type="text"
                                        name="cnpj"
                                        placeholder=""
                                        value={novoAdmCnpj}
                                        onChange={(e) => setNovoAdmCnpj(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-lg font-semibold text-[#030430]">Telefone</Label>
                                    <Input
                                        className=""
                                        type="text"
                                        name="telefone"
                                        placeholder=""
                                        value={novoAdmTelefone}
                                        onChange={(e) => setNovoAdmTelefone(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-row gap-2 justify-end items-end">
                                    <Button variant="outline" className="w-24" onClick={() => setCadastrarAdmDialogOpen(false)}>Cancelar</Button>
                                    <Button className="w-24" onClick={handleCadastrarAdm} disabled={loading}>
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
                                <TableHead>CNPJ</TableHead>
                                <TableHead>Telefone</TableHead>
                                <TableHead>Editar</TableHead>
                                <TableHead>Excluir</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8">
                                        <Loader2 className="animate-spin h-6 w-6 mx-auto text-gray-500" />
                                        <p className="mt-2 text-gray-500">Carregando administradores...</p>
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center text-red-500 py-8">
                                        {error}
                                    </TableCell>
                                </TableRow>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((administrador, index) => (
                                    <TableRow key={index} className="">
                                        <TableCell className="">{administrador.id}</TableCell>
                                        <TableCell className="">{administrador.nome}</TableCell>
                                        <TableCell className="">{administrador.email}</TableCell>
                                        {/* <TableCell className="">{administrador.senha}</TableCell> */}
                                        <TableCell className="">{administrador.cnpj}</TableCell>
                                        <TableCell className="">{administrador.telefone}</TableCell>
                                        <TableCell>
                                            {/* Modal de Edição de Advogado */}
                                            <Dialog open={editarAdmDialogOpen && editandoAdm?.id === administrador.id} onOpenChange={setEditarAdmDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" onClick={() => handleOpenEditarAdmDialog(administrador)}>
                                                        <Edit className="text-gray-600" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="px-10">
                                                    <DialogTitle className="text-center text-[#030430] text-xl">Editar Informações do administrador</DialogTitle>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-lg font-semibold text-[#030430]">Nome</Label>
                                                        <Input
                                                            className=""
                                                            type="text"
                                                            name="admNome"
                                                            value={editarAdmNome}
                                                            onChange={(e) => setEditarAdmNome(e.target.value)}
                                                            placeholder="nome do administrador"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-lg font-semibold text-[#030430]">Email</Label>
                                                        <Input
                                                            className=""
                                                            type="email"
                                                            name="admEmail"
                                                            value={editarAdmEmail}
                                                            onChange={(e) => setEditarAdmEmail(e.target.value)}
                                                            placeholder="email do administrador"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-lg font-semibold text-[#030430]">Senha</Label>
                                                        <Input
                                                            className=""
                                                            type="text"
                                                            name="admSenha"
                                                            value={editarAdmSenha}
                                                            onChange={(e) => setEditarAdmSenha(e.target.value)}
                                                            placeholder="senha para o administrador"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-lg font-semibold text-[#030430]">CNPJ</Label>
                                                        <Input
                                                            className=""
                                                            type="text"
                                                            name="admCNPJ"
                                                            value={editarAdmCnpj}
                                                            onChange={(e) => setEditarAdmCnpj(e.target.value)}
                                                            placeholder=""
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Label className="text-lg font-semibold text-[#030430]">Telefone</Label>
                                                        <Input
                                                            className=""
                                                            type="text"
                                                            name="admTelefone"
                                                            value={editarAdmTelefone}
                                                            onChange={(e) => setEditarAdmTelefone(e.target.value)}
                                                            placeholder=""
                                                        />
                                                    </div>
                                                    <div className="flex flex-row gap-2 justify-end items-end">
                                                        <Button variant="outline" className="w-24" onClick={() => setEditarAdmDialogOpen(false)}>Cancelar</Button>
                                                        <Button className="w-24" onClick={handleUpdateAdministrador} disabled={loading}>
                                                            {loading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Editar'}
                                                        </Button>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell>
                                            {/* Modal de Exclusão de Advogado */}
                                            <Dialog open={deletarAdmDialogOpen && deletandoAdm?.id === administrador.id} onOpenChange={setDeletarAdmDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" onClick={() => handleOpenDeletarAdmDialog(administrador)}>
                                                        <Trash2 className="text-gray-600" />
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex justify-center font-bold text-xl text-[#030430]">Excluir Administrador(a)</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="grid gap-4 py-4">
                                                        <h1 className="text-center">Você tem certeza que quer excluir a conta do(a)</h1>
                                                        <strong className="text-[#030430] text-xl text-center">Dr.(a) {deletandoAdm?.nome}</strong>
                                                        <h1 className="text-center">do JurisControl</h1>
                                                    </div>
                                                    <DialogFooter className="flex flex-row gap-2 justify-end">
                                                        <Button variant="outline" className="" onClick={() => setDeletarAdmDialogOpen(false)}>Cancelar</Button>
                                                        <Button type="submit" className="text-white bg-red-600 hover:bg-red-900" onClick={handleDeletarAdministrador} disabled={loading}>
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
                                        Nenhum administrador encontrado com o termo de busca.
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
                                    proxPag === 1 || administradores.length === 0
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
                                    proxPag === totalPages || administradores.length === 0
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