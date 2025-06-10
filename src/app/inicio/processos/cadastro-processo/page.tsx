'use client';

import React, { useEffect, useState } from "react"
import Link from "next/link"

import NavBar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeftIcon, Trash2Icon } from "lucide-react"
import { toast, ToastContainer, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from "next/navigation";
import { withAuth } from "@/utils/withAuth";

interface CadastroProcesso {
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
    movimentos: [];
    anexoDocumentos: [],
    advogadoId: number | null;
}

function Page() {
    const [advogadoNome, setAdvogadoNome] = useState<string | null>(null);
    const [advogadoId, setAdvogadoId] = useState<number | null>(null);
    const [authToken, setAuthToken] = useState<string | null>(null);
    
    const [numeroProcesso, setNumeroProcesso] = useState<string>('');
    const [vara, setVara] = useState<string>('');
    const [classeTipo, setClasseTipo] = useState<string>('');
    const [assuntosTitulo, setAssuntosTitulo] = useState<string>('');
    const [comarcaUF, setComarcaUF] = useState<string>('');
    const [status, setStatus] = useState<string>('Iniciado');
    const [nomeAutor, setNomeAutor] = useState<string>('');
    const [telefoneCliente, setTelefoneCliente] = useState<string>('');
    const [advogadoAutor, setAdvogadoAutor] = useState<string>('');
    const [nomeReu, setNomeReu] = useState<string>('');
    const [advogadoReu, setAdvogadoReu] = useState<string>('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

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
        // const nomeDoAdvogado = sessionStorage.getItem('advogadoNome');
        const idDoAdvogado = sessionStorage.getItem('advogadoId');
        const token = sessionStorage.getItem('authToken');
        
        // setAdvogadoNome(nomeDoAdvogado);
        if (idDoAdvogado) {
            setAdvogadoId(parseInt(idDoAdvogado, 10));
        }
        setAuthToken(token);

        
    }, []);

    const handleCadastrarProcesso = async () => {
        if (!authToken) {
            toast.error("Token de autenticação não encontrado.", toastOptions);
            return;
        }

        if (!advogadoId) {
            toast.error("ID do advogado não encontrado. Faça login novamente.", toastOptions);
            return;
        }

        setIsSubmitting(true);

        const cadastroP: CadastroProcesso = {
            numeroProcesso,
            vara,
            classeTipo,
            assuntosTitulo,
            comarcaUF,
            status,
            nomeAutor,
            telefoneCliente,
            advogadoAutor,
            nomeReu,
            advogadoReu,
            movimentos: [],
            anexoDocumentos: [],
            advogadoId: advogadoId,
        };

        try {
            const response = await fetch('https://backendjuriscontrol.onrender.com/api/cadastrar-processo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
                body: JSON.stringify(cadastroP),
            });

            if (response.ok) {
                toast.success("Processo cadastrado com sucesso!", toastOptions);
                router.push('/inicio/processos');
            } else {
                const errorData = await response.json();
                toast.error(`Erro ao cadastrar processo: ${errorData?.message || 'Erro desconhecido'}`, toastOptions);
            }
        } catch (error: any) {
            toast.error(`Erro ao cadastrar processo: ${error.message}`, toastOptions);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center mb-3">
            <NavBar
                nome="Cadastro de processo"
                botaoVoltar={
                    <Link className="p-0 m-0 flex items-center" href="/inicio/processos">
                        <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
                            <ChevronLeftIcon style={{ width: "35px", height: "35px" }} className=""></ChevronLeftIcon>
                        </Button>
                    </Link>
                } />

            <ToastContainer />
            <Card className="w-[97%] border-none">
                <CardContent>
                    <div className="flex flex-col justify-center gap-3 items-center">
                        <Card className="w-full">
                            <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
                                <CardTitle className="text-lg">Informações do Processo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-6 mt-5">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="numeroProcesso" className="text-base">Número do processo</Label>
                                            <Input
                                                type="text"
                                                id="numeroProcesso"
                                                value={numeroProcesso}
                                                onChange={(e) => setNumeroProcesso(e.target.value)}
                                                placeholder="0000001-23.2024.4.01.9000"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="vara" className="text-base">Vara</Label>
                                            <Input
                                                type="text"
                                                id="vara"
                                                value={vara}
                                                onChange={(e) => setVara(e.target.value)}
                                                placeholder=""
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="classe" className="text-base">Classe (Tipo do processo)</Label>
                                            <Input
                                                type="text"
                                                id="classeTipo"
                                                value={classeTipo}
                                                onChange={(e) => setClasseTipo(e.target.value)}
                                                placeholder="Ex: Execução Fiscal"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="assuntos" className="text-base">Assunto (Título)</Label>
                                            <Input
                                                type="text"
                                                id="assuntosTitulo"
                                                value={assuntosTitulo}
                                                onChange={(e) => setAssuntosTitulo(e.target.value)}
                                                placeholder="Ex: Dívida Ativa (Execução Fiscal)"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="assuntos" className="text-base">Comarca / UF</Label>
                                            <Input
                                                type="text"
                                                id="comarcaUF"
                                                value={comarcaUF}
                                                onChange={(e) => setComarcaUF(e.target.value)}
                                                placeholder=""
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2 w-full">
                                            <Label htmlFor="statusSelect" className="text-base">Status</Label>
                                            <Select value={status} onValueChange={setStatus} >
                                                <SelectTrigger className="w-full border-gray-300 border-2">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Situação do Processo</SelectLabel>
                                                        <SelectItem value="Distribuído">Distribuído</SelectItem>
                                                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                                        <SelectItem value="Finalizado">Finalizado</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full">
                            <CardHeader className="bg-[#030430] h-14 justify-center rounded-t-lg text-white items-start">
                                <CardTitle className="text-lg">Partes do Processo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-6 mt-5">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 sm:grid-cols-2">

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Cliente</Label>
                                            <Input
                                                type="text"
                                                id="nomeAutor"
                                                value={nomeAutor}
                                                onChange={(e) => setNomeAutor(e.target.value)}
                                                placeholder="Nome do cliente"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Telefone</Label>
                                            <Input
                                                type="tel"
                                                id="telefoneCliente"
                                                value={telefoneCliente}
                                                onChange={(e) => setTelefoneCliente(e.target.value)}                                                
                                                placeholder="Telefone do cliente"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>

                                        {/* <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Advogado do cliente</Label>
                                            <Input
                                                type="text"
                                                id="advogadoAutor"
                                                value={advogadoAutor}
                                                onChange={(e) => setAdvogadoAutor(e.target.value)}
                                                placeholder="Nome do Advogado do autor"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div> */}
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Réu</Label>
                                            <Input
                                                type="text"
                                                id="nomeReu"
                                                value={nomeReu}
                                                onChange={(e) => setNomeReu(e.target.value)}
                                                placeholder="Nome da parte Adversa"
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div>
                                        {/* <div className="flex flex-col gap-2">
                                            <Label htmlFor="text" className="text-base">Advogado parte Adversa</Label>
                                            <Input
                                                type="text"
                                                id="advogadoReu"
                                                value={advogadoReu}
                                                onChange={(e) => setAdvogadoReu(e.target.value)}
                                                placeholder=""
                                                className="w-full border-gray-300 border-2"
                                            />
                                        </div> */}

                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    <div className="flex flex-row justify-end gap-2 items-center mt-5">
                        <Button variant="outline" className="h-12 w-28 border-2 bg-gray-100">Cancelar</Button>
                        <Button 
                            className="bg-green-700 border-2 hover:bg-green-900 h-12 w-28 shadow-2xl"
                            onClick={handleCadastrarProcesso}
                            disabled={isSubmitting}
                        >
                                {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default withAuth(['advogado'])(Page);
