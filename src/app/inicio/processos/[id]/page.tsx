'use client';

import { useParams } from "next/navigation"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/navbar";
import { useEffect, useState } from "react";
import axios from "axios";
// import { set } from "date-fns";
import { toast, ToastPosition } from "react-toastify";
import router from "next/router";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
    movimentos: Movimento[];
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
    anexo: string;
    processoId: number;
}

function TestDialogButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Testar Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Teste Funcionando</DialogTitle>
        </DialogHeader>
        <p>Se isso aparecer, o dialog está configurado corretamente</p>
      </DialogContent>
    </Dialog>
  );
}

export default function Page() {
    const params = useParams()
    const id = params.id as string // Isso pegará o ID da URL

    const [processo, setProcesso] = useState<ProcessoDetalhado | null>(null)
    const [advogadoId, setAdvogadoId] = useState<string | null>(null)
    const [authToken, setAuthToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    
    const [movimentos, setMovimentos] = useState<Movimento[]>([])
    const [novoMovimento, setNovoMovimento] = useState({
        nomeMovimento: "",
        tipo: "",
        data: new Date(),
        processoId: Number(id)
    });

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

    // Método 'GET' para buscar os detalhes do processo pelo seu "id"
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

    // Método 'POST' para adicionar um movimento associado ao processo
    const handleAdicionarMovimento = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!novoMovimento.nomeMovimento.trim() || !novoMovimento.tipo || !novoMovimento.data) {
            toast.error("Preencha todos os campos obrigatórios");
            return;
        }

        try {
            const movimentoParaEnviar = {
                ...novoMovimento,
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
            
            toast.success("Movimento adicionado com sucesso!");
            return response.data;
        } catch (error: any) {
            toast.error("Erro ao cadastrar o movimento");
            console.error(error);
        }
    };

    // Método 'GET' para a lista de todos os movimentos criados
    const fetchMovimentos = async () => {
        if (!id || !authToken) return;
            
        setLoading(true);
        try {
            const response = await axios.get<Movimento[]>(`https://backendjuriscontrol.onrender.com/api/buscar-movimentos`);
            setMovimentos(response.data);
        } catch (error) {
            console.error('Erro ao buscar os movimentos:', error);
        }
        useEffect(() => {
            if (authToken) {
                fetchMovimentos();
            }
        }, [authToken]);
    }

    //Método 'POST' para adicionar o anexo ao processo
    const handleAdicionarAnexo = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!novoAnexo.nomeAnexo.trim() || !novoAnexo.anexo) {
            toast.error("Preencha todos os campos obrigatórios");
            return;
        }

        try {
            const formData = new FormData();
                formData.append('nomeAnexo', novoAnexo.nomeAnexo);
                formData.append('anexo', anexo!); // o arquivo selecionado
                formData.append('processoId', String(id));

            const response = await axios.post(
                `https://backendjuriscontrol.onrender.com/api/cadastrar-anexo`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Atualize a lista de anexos
            setAnexos(prev => [response.data, ...prev]);

            setNovoAnexo({
                nomeAnexo: "",
                anexo: "",
                processoId: Number(id)
            });
            
            toast.success("Anexo adicionado com sucesso!");
            return response.data;
        } catch (error: any) {
            toast.error("Erro ao cadastrar o anexo");
            console.error(error);
        }
    }

    //Método 'GET' para a lista de todos os anexos criados
    const fetchAnexos = async () => {
        if (!id || !authToken) return;
            
        setLoading(true);
        try {
            const response = await axios.get<Anexo[]>(`https://backendjuriscontrol.onrender.com/api/buscar-todos-anexos`);
            setAnexos(response.data);
        } catch (error) {
            console.error('Erro ao buscar os anexos:', error);
        }

        useEffect(() => {
            if (authToken) {
                fetchAnexos();
            }
        }, [authToken]);
    }

    useEffect(() => {
        if (authToken) {
            fetchMovimentos();
            fetchAnexos();
        }
    }, [authToken]);

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

            <div className="flex flex-col w-11/12 justify-center items-center gap-2 sm:flex-row h-auto">
                <Card className="w-full rounded-xl md:w-1/3 h-[600px] flex flex-col">
                    <CardHeader className="bg-[#030430] justify-between items-center h-14 rounded-t-lg text-white flex flex-row px-4">
                        <CardTitle className="text-lg">Movimentos</CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="bg-white text-[#030430] hover:bg-gray-100 text-sm"
                                >
                                    Adicionar Movimento
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
                                                Tipo do Movimento:
                                            </span>
                                        </Label>
                                        <Select
                                            value={novoMovimento.tipo}
                                            onValueChange={(value) => setNovoMovimento({ ...novoMovimento, tipo: value })}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {tiposMovimento.map((tipo) => (
                                                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                <div key={movimento.id} className="mb-4">
                                    <p className="font-semibold">Movimento:</p>
                                    <p>{movimento.nomeMovimento}</p>
                                    <p className="font-semibold">Data:</p>
                                    <p>{new Date(movimento.data).toLocaleDateString()}</p>
                                    <p className="font-semibold">Tipo:</p>
                                    <p>{movimento.tipo}</p>
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

                <div className="w-full md:w-2/3 flex flex-col gap-2 h-[600px]">
                    <Card className="w-full h-[75%] flex flex-col">
                        <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
                                <CardTitle className="text-lg">Processo Nº {processo?.numeroProcesso}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4">
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <Loader2 className="animate-spin h-6 w-6 mx-auto text-gray-500" />
                                </div>
                            ) : processo ? (
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
                                            processo.status === "Distribuído" ? "bg-sky-600" :
                                            processo.status === "Em Andamento" ? "bg-blue-500" :
                                            processo.status === "Aguardando Decisão" ? "bg-yellow-600" :
                                            processo.status === "Sentenciado" ? "bg-green-600" :
                                            processo.status === "Recursos" ? "bg-orange-600" :
                                            processo.status === "Execução" ? "bg-emerald-600" :
                                            processo.status === "Suspenso" ? "bg-gray-600" :
                                            processo.status === "Concluído" ? "bg-indigo-600" :
                                            processo.status === "Arquivado" ? "bg-slate-500" : "bg-black"
                                        }`}>
                                            {processo.status || "Sem Dados"}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">Nenhum dado do processo disponível</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="w-full h-[25%] flex flex-col">
                        <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
                            <CardTitle className="text-lg"> Documentos Anexados</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 flex items-center justify-center p-0">
                            {loading ? (
                                <Loader2 className="animate-spin h-6 w-6 mx-auto text-gray-500 p-4" />
                            ) : (
                                anexos && anexos.length > 0 ? (
                                anexos.map((anexo) => (
                                <div key={anexo.id} className="mb-4">
                                    <p className="font-semibold">Movimento:</p>
                                    <p>{anexo.nomeAnexo}</p>
                                    <p className="font-semibold">Data:</p>
                                    <p>{anexo.anexo.toLocaleString()}</p>
                                    <p className="font-semibold">Tipo:</p>
                                    <p>{anexo.tipoAnexo}</p>
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