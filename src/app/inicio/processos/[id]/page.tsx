'use client';

import { useParams } from "next/navigation"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, Loader2, SquarePen } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/navbar";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { toast, ToastContainer, ToastPosition } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from "@/components/ui/select";
import { withAuth } from "@/utils/withAuth";
import { set } from "react-hook-form";
import { Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ProcessoDetalhado {
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

interface Movimento {
    id: number;
    nomeMovimento: string;
    tipo: string;
    data: Date;
    processoId: number;
}

const tiposMovimento = [
  "Petição",
  "Decisão",
  "Sentença",
  "Audiência",
  "Recurso",
  "Protocolo",
  "Outros"
];

interface Anexo {
    id: number;
    nomeAnexo: string;
    tipoAnexo: string;
    anexo: File;
    processoId: number;
}

function Page() {
    const params = useParams()
    const id = params.id as string // Isso pegará o ID da URL

    // Criar Processo, Buscar Detalhes do Processo, Autenticar Advogado
    const [processo, setProcesso] = useState<ProcessoDetalhado | null>(null)
    const [advogadoId, setAdvogadoId] = useState<string | null>(null)
    const [authToken, setAuthToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    // Abrir e Fechar Modais
    const [abrirProcesso, setAbrirProcesso] = useState(false);
    const [editarProcesso, setEditarProcesso] = useState(false);
    const [abrirMovimento, setAbrirMovimento] = useState(false);
    const [editarMovimento, setEditarMovimento] = useState(false);
    const [abrirAnexo, setAbrirAnexo] = useState(false);
    const [editarAnexo, setEditarAnexo] = useState(false);
    
    // Editar Processo
    const [nomeAutor, setNomeAutor] = useState(processo?.nomeAutor || "");
    const [telefoneCliente, setTelefoneCliente] = useState(processo?.telefoneCliente || "");
    const [advogadoAutor, setAdvogadoAutor] = useState(processo?.advogadoAutor || "");
    const [nomeReu, setNomeReu] = useState(processo?.nomeReu || "");
    const [advogadoReu, setAdvogadoReu] = useState(processo?.advogadoReu || "");
    const [classeTipo, setClasseTipo] = useState(processo?.classeTipo || "");
    const [assuntosTitulo, setAssuntosTitulo] = useState(processo?.assuntosTitulo || "");
    const [comarcaUF, setComarcaUF] = useState(processo?.comarcaUF || "");
    const [status, setStatus] = useState(processo?.status || "");
    const [vara, setVara] = useState(processo?.vara || "");
    
    // Criar Movimento e Lista de Movimentos
    const [movimentos, setMovimentos] = useState<Movimento[]>([])
    const [novoMovimento, setNovoMovimento] = useState({
        nomeMovimento: "",
        tipo: "",
        data: new Date(),
        processoId: Number(id)
    });

    // Editar Movimento
    const [movimento, setMovimento] = useState<Movimento | null>(null);
    const [nomeMovimento, setNomeMovimento] = useState(movimento?.nomeMovimento || "");
    const [tipo, setTipo] = useState(movimento?.tipo || "");
    const [dataMovimento, setDataMovimento] = useState(movimento?.data.toISOString().split('T')[0] || "");

    // Criar Anexo e Lista de Anexos
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [anexo, getAnexo] = useState<File | null>(null);
    const [anexos, setAnexos] = useState<Anexo[]>([]);
    const [novoAnexo, setNovoAnexo] = useState({
        nomeAnexo: "",
        anexo: "",
        processoId: Number(id)
    });

    // Verifica se o Advogado está logado
    useEffect(() => {
        const id = sessionStorage.getItem('advogadoId');
        const token = sessionStorage.getItem('authToken');
        
        if (id && token) {
            setAdvogadoId(id);
            setAuthToken(token);
        } else {
            toast.error("ID do advogado ou token não encontrados. Faça login novamente.", toastOptions);
            router.push("/login");
        }
    }, []);

    // Método 'GET' para buscar os detalhes do PROCESSO pelo seu "id"
    useEffect(() => {
        const fetchProcessoDetalhes = async () => {
            if (!id || !authToken) return;
            
            setLoading(true);
            try {
                const response = await axios.get<ProcessoDetalhado>(
                    `https://backendjuriscontrol.onrender.com/api/buscar-processo/${id}`, 
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                setProcesso(response.data);
            } catch (error) {
                toast.error('Erro ao carregar detalhes do processo', toastOptions);
                console.error('Erro:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchProcessoDetalhes();
        }
    }, [id, authToken]);

    // Método 'GET' para a lista de todos os MOVIMENTOS criados
    useEffect(() => {
        const fetchMovimentos = async () => {
            if (!id || !authToken) return;
            
            setLoading(true);
            try {
                const response = await axios.get<Movimento[]>(
                    `https://backendjuriscontrol.onrender.com/api/buscar-todos-movimentos/${id}`, 
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                setMovimentos(response.data);
            } catch (error) {
                toast.error('Erro ao carregar os movimentos', toastOptions);
                console.error('Erro:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchMovimentos();
        }
    }, [id, authToken]);

    // Método 'GET' para a lista de todos os ANEXOS criados
    useEffect(() => {
        const fetchAnexos = async () => {
            if (!id || !authToken) return;
            
            setLoading(true);
            try {
                const response = await axios.get<Anexo[]>(
                    `https://backendjuriscontrol.onrender.com/api/buscar-todos-anexos/${id}`, 
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                setAnexos(response.data);
            } catch (error) {
                toast.error('Erro ao carregar os movimentos', toastOptions);
                console.error('Erro:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchAnexos();
        }
    }, [id, authToken]);

    // Pega os valores de cada campo do processo (será usado no 'PUT' para editar os detalhes do processo)
    useEffect(() => {
        if (processo) {
            setNomeAutor(processo.nomeAutor || "");
            setTelefoneCliente(processo.telefoneCliente || "");
            setAdvogadoAutor(processo.advogadoAutor || "");
            setNomeReu(processo.nomeReu || "");
            setAdvogadoReu(processo.advogadoReu || "");
            setClasseTipo(processo.classeTipo || "");
            setAssuntosTitulo(processo.assuntosTitulo || "");
            setComarcaUF(processo.comarcaUF || "");
            setStatus(processo.status || "");
            setVara(processo.vara || "");
        }
    }, [processo]);

    // Método 'PUT' para editar os detalhes do PROCESSO (com 'GET' para buscar os detalhes atualizados)
    const handleEditarProcesso = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            nomeAutor,
            telefoneCliente,
            advogadoAutor,
            nomeReu,
            advogadoReu,
            status,
            classeTipo,
            assuntosTitulo,
            comarcaUF,
            vara,
            advogadoId
        };

        try {
            await axios.put(
                `https://backendjuriscontrol.onrender.com/api/atualizar-processo/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success("Processo editado com sucesso!", toastOptions);
            const response = await axios.get<ProcessoDetalhado>(
                `https://backendjuriscontrol.onrender.com/api/buscar-processo/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setProcesso(response.data);
            setEditarProcesso(false);
        } catch (error) {
            toast.error('Erro ao editar o processo', toastOptions);
            console.error('Erro:', error);
        }
    }

    // Método 'DELETE' para excluir o PROCESSO
    const handleExcluirProcesso = async () => {
        try {
            await axios.delete(
                `https://backendjuriscontrol.onrender.com/api/deletar-processo/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            toast.success("Processo excluido com sucesso!", toastOptions);
            router.push('/inicio/processos');
        } catch (error) {
            toast.error('Erro ao excluir o processo', toastOptions);
            console.error('Erro:', error);
        }
    }

    // Método 'POST' para adicionar um MOVIMENTO associado ao processo
    const handleAdicionarMovimento = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!novoMovimento.nomeMovimento.trim() || !novoMovimento.tipo || !novoMovimento.data) {
            toast.error("Preencha todos os campos obrigatórios");
            return;
        }

        try {
            const movimentoParaEnviar = {
                ...novoMovimento,
                tipo: novoMovimento.tipo,
                data: novoMovimento.data.toISOString(),
                processoId: Number(id)
            };

            const response = await axios.post(
                `https://backendjuriscontrol.onrender.com/api/cadastrar-movimento`,
                movimentoParaEnviar,
                { 
                    headers: { 
                        Authorization: `Bearer ${authToken}`, 
                        'Content-Type': 'application/json' 
                    } 
                }
            );

            // Atualize a lista de movimentos
            setMovimentos(prev => [response.data, ...prev]);

            setNovoMovimento({
                nomeMovimento: "",
                tipo: "",
                data: new Date(),
                processoId: Number(id)
            });
            
            if (response.status === 200 || response.status === 201) {
                toast.success("Movimento cadastrado com sucesso!", toastOptions);
                setAbrirMovimento(false);
            } else {
                const errorData = response.data;
                toast.error(`Erro ao cadastrar o movimento: ${errorData?.message || 'Erro desconhecido'}`, toastOptions);
                setAbrirMovimento(false);
            }

        } catch (error: any) {
            toast.error("Erro ao cadastrar o movimento");
            console.error(error);
            setAbrirMovimento(false);
        }
    };

    // Método 'PUT' para editar o Movimento
    const handleEditarMovimento = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            nomeMovimento,
            tipo,
            dataMovimento
        };
        
        try {
            await axios.put(
                `https://backendjuriscontrol.onrender.com/api/atualizar-movimento/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            toast.success("Movimento editado com sucesso!", toastOptions);
            const response = await axios.get<Movimento>(
                `https://backendjuriscontrol.onrender.com/api/buscar-movimento/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setMovimento(response.data);
            setEditarMovimento(false);
        } catch (error) {
            toast.error('Erro ao editar o movimento', toastOptions);
            console.error('Erro:', error);
            setEditarMovimento(false);
        }
    }

    // Método 'POST' para adicionar um ANEXO associado ao processo
    // 

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
        <div className="flex flex-col justify-center items-center mb-4">
            <NavBar
                nome="Detalhes do Processo"
                botaoVoltar={
                    <Link className="p-0 m-0 flex items-center" href="/inicio/processos">
                        <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
                            <ChevronLeftIcon style={{ width: "35px", height: "35px" }} />
                        </Button>
                    </Link>
                }
            />

            <ToastContainer />

            <div className="flex flex-col w-11/12 justify-center items-center gap-2 sm:flex-row h-auto">
                {/*Movimentos*/}
                <Card className="w-full rounded-xl md:w-1/3 h-[600px] flex flex-col">
                    <CardHeader className="bg-[#030430] !space-y-0 justify-between items-center h-14 rounded-t-lg text-white flex flex-row">
                        <CardTitle className="text-lg">Movimentos</CardTitle>
                        <Dialog open={abrirMovimento} onOpenChange={setAbrirMovimento}>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="outline"
                                    size="add"
                                    className="bg-white text-[#030430] hover:bg-gray-100 text-sm flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4 lg:hidden" />
                                    <span className="hidden lg:block">Adicionar Movimento</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="">Adicionar Movimento</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAdicionarMovimento} className="space-y-4">
                                    <div className="space-y-2 mt-4">
                                        <Label className="block">
                                            <span>
                                                Nome do Movimento:
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={novoMovimento.nomeMovimento}
                                            onChange={(e) => setNovoMovimento({ ...novoMovimento, nomeMovimento: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="block">
                                            <span>
                                                Data do Movimento:
                                            </span>
                                        </Label>
                                        <Input
                                            type="date"
                                            value={novoMovimento.data.toISOString().split('T')[0]}
                                            onChange={(e) => setNovoMovimento({ ...novoMovimento, data: new Date(e.target.value) })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="block">
                                            <span>
                                                Observação do Movimento:
                                            </span>
                                        </Label>
                                        <Textarea
                                            value={novoMovimento.tipo}
                                            onChange={(e) => setNovoMovimento({ ...novoMovimento, tipo: e.target.value })}
                                            className="mt-1"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Salvar</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Loader2 className="animate-spin h-6 w-6 mx-auto text-gray-500" />
                            </div>
                        ) : (
                            movimentos && movimentos.length > 0 ? (
                            movimentos.map((movimento) => (
                                <div key={movimento.id} className="mb-4 border-2 border-gray-300 rounded-md p-2">
                                    <div className="flex flex-col">
                                        <p className="font-semibold">Movimento:</p>
                                        <p>{movimento.nomeMovimento}</p>
                                        <p className="font-semibold">Data:</p>
                                        <p>{new Date(movimento.data).toLocaleDateString()}</p>
                                        <p className="font-semibold">Observação:</p>
                                        <p>{movimento.tipo}</p>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button>
                                                    <SquarePen className="w-4 h-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle className="">Editar Movimento</DialogTitle>
                                                </DialogHeader>
                                                <form onSubmit={handleEditarMovimento} className="space-y-4">
                                                    <div className="space-y-2 mt-4">
                                                        <Label className="block">
                                                            <span>
                                                                Nome do Movimento:
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            value={nomeMovimento || ""}
                                                            onChange={(e) => setNomeMovimento(e.target.value)}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="block">
                                                            <span>
                                                                Data do Movimento:
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            type="date"
                                                            value={dataMovimento || ""}
                                                            onChange={(e) => setDataMovimento(new Date(e.target.value).toISOString().split('T')[0])}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="block">
                                                            <span>
                                                                Observação do Movimento:
                                                            </span>
                                                        </Label>
                                                        <Textarea
                                                            value={tipo || ""}
                                                            onChange={(e) => setTipo(e.target.value)}
                                                            className="mt-1"
                                                        />
                                                    </div>
                                                    <DialogFooter>
                                                        <Button type="submit">Salvar</Button>
                                                    </DialogFooter>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            ))
                            ) : (
                            <div className="h-full">
                                <p>Histórico dos Movimentos...</p>
                            </div>
                            )
                        )}
                    </CardContent>
                </Card>
                
                {/*Detalhe do Processo*/}
                <div className="w-full md:w-2/3 flex flex-col gap-2 h-[600px]">
                    <Card className="w-full h-[75%] flex flex-col">
                        <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
                                <CardTitle className="text-lg">Processo Nº {processo?.numeroProcesso || "Nd"}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4">
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <Loader2 className="animate-spin h-6 w-6 mx-auto text-gray-500" />
                                </div>
                            ) : processo ? (
                                <div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="font-semibold">Cliente:</p>
                                            <p>{processo.nomeAutor || "Sem Dados"}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Telefone:</p>
                                            <p>{processo.telefoneCliente || "Sem Dados"}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Vara:</p>
                                            <p>{processo.vara || "Sem Dados"}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Classe:</p>
                                            <p>{processo.classeTipo || "Sem Dados"}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Assunto:</p>
                                            <p>{processo.assuntosTitulo || "Sem Dados"}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Comarca/UF:</p>
                                            <p>{processo.comarcaUF || "Sem Dados"}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Réu:</p>
                                            <p>{processo.nomeReu || "Sem Dados"}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Advogado do Réu:</p>
                                            <p>{processo.advogadoReu || "Sem Dados"}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="font-semibold">Status:</p>
                                            <span className={`inline-block px-3 py-1 rounded-full text-white ${
                                                processo.status === "Iniciado" ? "bg-amber-400" :
                                                processo.status === "Em Andamento" ? "bg-blue-500" :
                                                processo.status === "Concluído" ? "bg-emerald-600" : "bg-black"
                                            }`}>
                                                {processo.status || "Sem Dados"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-3 md:mt-0">
                                        <Dialog open={editarProcesso} onOpenChange={setEditarProcesso}>
                                            <DialogTrigger asChild>
                                                <Button>Editar</Button>
                                            </DialogTrigger>
                                            <DialogContent className="flex flex-col sm:max-w-[470px] max-h-[90vh] overflow-y-auto p-6">
                                                <DialogTitle className="text-center text-lg font-semibold mb-2 mt-3">Editar Processo Nº {processo?.numeroProcesso || "Nd"}</DialogTitle>
                                                <form onSubmit={handleEditarProcesso}>
                                                    <div className="flex flex-col space-y-2 p-2">
                                                        <Label className="block text-base">
                                                            <span>
                                                                Nome do Autor:
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            name="nomeAutor"
                                                            value={nomeAutor || ""}
                                                            onChange={(e) => setNomeAutor(e.target.value)}
                                                        />
                                                        <Label className="block text-base">
                                                            <span>
                                                                Telefone do Autor:
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            name="telefoneAutor"
                                                            value={telefoneCliente || ""}
                                                            onChange={(e) => setTelefoneCliente(e.target.value)}
                                                        />
                                                        <Label className="block text-base">
                                                            <span>
                                                                Advogado do Autor:
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            name="advogadoAutor"
                                                            value={advogadoAutor || ""}
                                                            onChange={(e) => setAdvogadoAutor(e.target.value)}
                                                        />
                                                        <Label className="block text-base">
                                                            <span>
                                                                Nome do Réu:
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            name="nomeReu"
                                                            value={nomeReu || ""}
                                                            onChange={(e) => setNomeReu(e.target.value)}
                                                        />
                                                        <Label className="block text-base">
                                                            <span>
                                                                Advogado do Réu:
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            name="advogadoReu"
                                                            value={advogadoReu || ""}
                                                            onChange={(e) => setAdvogadoReu(e.target.value)}
                                                        />
                                                        <Label className="block text-base">
                                                            <span>
                                                                Vara:
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            name="vara"
                                                            value={vara || ""}
                                                            onChange={(e) => setVara(e.target.value)}
                                                        />
                                                        <Label className="block text-base">
                                                            <span>
                                                                Status:
                                                            </span>
                                                        </Label>
                                                        <Select value={status || ""} onValueChange={(e) => setStatus(e)}>
                                                            <SelectTrigger className="w-full rounded-md border-gray-300 border-2 border-input">
                                                                <SelectValue placeholder={status || ""} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectItem value="Iniciado">Iniciado</SelectItem>
                                                                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                                                    <SelectItem value="Concluído">Concluído</SelectItem>
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <Label className="block text-base">
                                                            <span>
                                                                Classe:
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            name="classeTipo"
                                                            value={classeTipo || ""}
                                                            onChange={(e) => setClasseTipo(e.target.value)}
                                                        />
                                                        <Label className="block text-base">
                                                            <span>
                                                                Assuntos:
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            name="assuntosTitulo"
                                                            value={assuntosTitulo || ""}
                                                            onChange={(e) => setAssuntosTitulo(e.target.value)}
                                                        />
                                                        <Label className="block text-base">
                                                            <span>
                                                                Comarca:
                                                            </span>
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            name="comarcaUF"
                                                            value={comarcaUF || ""}
                                                            onChange={(e) => setComarcaUF(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="justify-end">
                                                        <Button className="mt-4" type="submit">Salvar</Button>
                                                    </div>  
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                        <Button
                                            onClick={handleExcluirProcesso}
                                        >Excluir</Button>
                                    </div>

                                </div>
                            ) : (
                                <p className="text-center text-gray-500">Nenhum dado do processo disponível</p>
                            )}
                        </CardContent>
                    </Card>

                    {/*Anexos*/}
                    <Card className="w-full h-[25%] flex flex-col">
                        <CardHeader className="bg-[#030430] !space-y-0 justify-between items-center h-14 rounded-t-lg text-white flex flex-row">
                            <CardTitle className="text-lg"> Documentos Anexados</CardTitle>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button 
                                        variant="outline"
                                        size="add"
                                        className="bg-white text-[#030430] hover:bg-gray-100 text-sm flex items-center gap-2"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Plus className="w-4 h-4 lg:hidden" />
                                        <span className="hidden lg:block">Adicionar Anexo</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle className="">Adicionar Anexo</DialogTitle>
                                    </DialogHeader>
                                    <form className="space-y-4">
                                        <div className="space-y-2 mt-4">
                                            <Label>Nome do Anexo (opcional):</Label>
                                            <Input
                                                placeholder="Ex: contrato.pdf"
                                                //value={novoAnexo.nomeAnexo}
                                                //onChange={(e) => setNovoAnexo({ ...novoAnexo, nomeAnexo: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2 mt-4">
                                            <Label>Tipo do Anexo:</Label>
                                            <Input
                                                placeholder="Ex: .pdf"
                                                //value={novoAnexo.tipoAnexo}
                                                //onChange={(e) => setNovoAnexo({ ...novoAnexo, tipoAnexo: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Arquivo:</Label>
                                            <Input
                                                type="file"
                                                ref={fileInputRef}
                                                accept="image/*, video/*,application/pdf"
                                                //onChange={(e) => {
                                                //    const file = e.target.files?.[0] || null;
                                                //    setNovoAnexo({ ...novoAnexo, anexo: file });
                                                //    if (file && !novoAnexo.nomeAnexo) {
                                                //        setNovoAnexo((prev) => ({ ...prev, nomeAnexo: file.name }));
                                                //    }
                                                //}}
                                            />
                                        </div>

                                        <DialogFooter>
                                            <Button type="submit">Salvar</Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center p-0">
                            {loading ? (
                                <Loader2 className="animate-spin h-6 w-6 mx-auto text-gray-500 p-4" />
                            ) : (
                                anexos && anexos.length > 0 ? (
                                anexos.map((anexo) => (
                                <div key={anexo.id} className="mb-4">
                                    <p className="font-semibold">Documento:</p>
                                    <p>{anexo.nomeAnexo}</p>
                                </div>
                            ))
                            ) : (
                                <div className="">
                                    <p className="">Área para upload de documentos...</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default withAuth(['advogado'])(Page);
