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
import GerenciarMovimento from "@/components/gerenciarMovimento";
import { AnexosCard } from "@/components/AnexosCard";
import { deleteAllAnexosByProcessoId } from "@/lib/baserow";

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

function Page() {
    const params = useParams()
    const id = params.id as string // Isso pegará o ID da URL
    const processoId = Number(params.id);
    console.log('id do processo: ', processoId);

    // Criar Processo, Buscar Detalhes do Processo, Autenticar Advogado
    const [processo, setProcesso] = useState<ProcessoDetalhado | null>(null)
    const [advogadoId, setAdvogadoId] = useState<string | null>(null)
    const [authToken, setAuthToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter();

    // Abrir e Fechar Modais
    const [abrirProcesso, setAbrirProcesso] = useState(false);
    const [editarProcesso, setEditarProcesso] = useState(false);

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
            await deleteAllAnexosByProcessoId(processoId);
            await axios.delete(
                `https://backendjuriscontrol.onrender.com/api/deletar-processo/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            toast.success("Processo excluido com sucesso!", toastOptions);
            // Aguarda 1,5 segundos para que o toast apareça antes de redirecionar
            setTimeout(() => {
                router.push('/inicio/processos');
            }, 1500);
        } catch (error) {
            toast.error('Erro ao excluir o processo', toastOptions);
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

            <div className="flex flex-col w-[95%] justify-center items-center gap-2 sm:flex-row sm:items-stretch">
                <GerenciarMovimento id={id} authToken={authToken! == null ? "" : authToken} toastOptions={toastOptions} />

                {/* Card Detalhe do Processo e Card de Anexos */}
                <div className="w-full md:w-[80%] flex flex-col gap-2">
                    <Card className="w-full flex flex-col"> 
                        <CardHeader className="flex flex-col md:flex-row bg-[#030430] justify-between h-18 md:h-14  rounded-t-lg text-white items-center px-4">
                            <CardTitle className="text-lg">Processo Nº {processo?.numeroProcesso || "Nd"}</CardTitle>
                            {/* Botões de edição e exclusão do processo */}
                            <div className="flex flex-row gap-2 items-center justify-center">
                                <Dialog open={editarProcesso} onOpenChange={setEditarProcesso}>
                                    <DialogTrigger asChild>
                                        <Button variant='outline' className="bg-transparent border-2 py-1">Editar</Button>
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
                                                            <SelectItem value="Distribuído">Distribuído</SelectItem>
                                                            <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                                            <SelectItem value="Finalizado">Finalizado</SelectItem>
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
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            className=""
                                        >
                                            Excluir
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                                        <DialogDescription>
                                            Tem certeza que deseja excluir este processo e todos os seus anexos e movimentos?
                                        </DialogDescription>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button variant="outline">Cancelar</Button>
                                            <Button
                                                variant="destructive"
                                                onClick={handleExcluirProcesso}
                                            >
                                                Confirmar Exclusão
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
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
                                            <span className={`inline-block px-3 py-1 rounded-full text-white ${processo.status === "Distribuído" ? "bg-blue-700" :
                                                processo.status === "Em Andamento" ? "bg-amber-400" :
                                                    processo.status === "Finalizado" ? "bg-stone-500" : "bg-black"
                                                }`}>
                                                {processo.status || "Sem Dados"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-gray-500">Nenhum dado do processo disponível</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Anexos - Definir flex-grow para que ele preencha a altura restante */}
                    <AnexosCard
                        processoId={processoId}
                        onDeleteProcesso={handleExcluirProcesso}
                    />
                </div>
            </div>
        </div>
    );
}

export default withAuth(['advogado'])(Page);
