"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, SquarePen, Edit } from "lucide-react";

interface Movimento {
    id: number;
    nomeMovimento: string;
    tipo: string;
    data: Date;
    processoId: number;
}

interface MovimentoProps {
    id: string | number;
    authToken: string;
    toastOptions?: any;
}

const Movimento = ({ id, authToken, toastOptions }: MovimentoProps) => {
    // Criar Movimento e Lista de Movimentos
    const [movimentos, setMovimentos] = useState<Movimento[]>([]);
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
    const [dataMovimento, setDataMovimento] = useState("");

    const [abrirMovimento, setAbrirMovimento] = useState(false);
    const [editarMovimento, setEditarMovimento] = useState(false);
    const [loading, setLoading] = useState(false);

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
                setMovimentos(
                    response.data.sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
                );
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

        if (!movimento) return;

        // Formata a data para o formato esperado pelo backend (LocalDateTime)
        const dataFormatada = new Date(dataMovimento).toISOString().replace('Z', '');

        const data = {
            nomeMovimento,
            tipo,
            data: dataFormatada,
            processoId: movimento.processoId
        };

        try {
            await axios.put(
                `https://backendjuriscontrol.onrender.com/api/atualizar-movimento/${movimento.id}`,
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
                `https://backendjuriscontrol.onrender.com/api/buscar-movimento/${movimento.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            setMovimentos(prev =>
                prev.map(m => m.id === response.data.id ? response.data : m)
            );

            setNovoMovimento({
                nomeMovimento: "",
                tipo: "",
                data: new Date(),
                processoId: Number(id)
            });

            setEditarMovimento(false);
        } catch (error) {
            toast.error('Erro ao editar o movimento', toastOptions);
            console.error('Erro:', error);
            setEditarMovimento(false);
        }
    }

    return (
        <Card className="w-full rounded-xl md:w-[30%] flex flex-col">
            <CardHeader className="bg-[#030430] !space-y-0 justify-between items-center px-3 h-14 rounded-t-lg text-white flex flex-row">
                <CardTitle className="text-lg">Movimentos</CardTitle>
                <Dialog open={abrirMovimento} onOpenChange={setAbrirMovimento}>
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            size="add"
                            className="bg-transparent text-white border-2 hover:bg-gray-100 text-sm flex items-center gap-2"
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
                            <div key={movimento.id} className="mb-4 border-2 border-gray-300 shadow-sm rounded-md p-2">
                                <div className="flex flex-col gap-2">

                                    <div className="flex flex-row justify-between">
                                        <div className="flex flex-col ">
                                            <p className="font-semibold">Movimento</p>
                                            <p className="text-gray-700">{movimento.nomeMovimento}</p>
                                        </div>
                                        <Dialog open={editarMovimento} onOpenChange={setEditarMovimento}>
                                            <DialogTrigger asChild>
                                                <Button className=" w-8 h-8 p-2" variant='outline' onClick={() => {
                                                    setMovimento(movimento);
                                                    setNomeMovimento(movimento.nomeMovimento);
                                                    setTipo(movimento.tipo);
                                                    if (movimento.data) {
                                                        const date = typeof movimento.data === 'string'
                                                            ? new Date(movimento.data)
                                                            : movimento.data;
                                                        setDataMovimento(date.toISOString().split('T')[0]);
                                                    } else {
                                                        setDataMovimento("");
                                                    } // Ajuste para o formato de data
                                                }}>
                                                    <Edit className="text-gray-600 w-5 h-5" />
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
                                                            onChange={(e) => setDataMovimento(e.target.value)}
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


                                    <div className="flex flex-col">
                                        <p className="font-semibold">Observação</p>
                                        <p className="break-words text-gray-700 whitespace-pre-wrap">{movimento.tipo}</p>
                                    </div>




                                    <p className="text-gray-500 font-normal position-absolute bottom-0 right-0 text-end">{new Date(movimento.data).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex justify-center items-center">
                            <p>Nenhum movimento encontrado...</p>
                        </div>
                    )
                )}
            </CardContent>
        </Card>
    );
};

export default Movimento;