'use client';

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { toast, ToastContainer, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { withAuth } from '@/utils/withAuth';
import NavBar from '@/components/navbar';
import Link from 'next/link';
import { ChevronLeftIcon, Lock } from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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

interface AdvogadoData {
    id: number;
    nome: string;
    email: string;
    registroOAB: string;
}

function Page() {
    const [advogadoId, setAdvogadoId] = useState<string | null>(null);
    const [authTokenAdvogado, setAuthTokenAdvogado] = useState<string | null>(null);

    const [editarNome, setEditarNome] = useState<string>('');
    const [editarEmail, setEditarEmail] = useState<string>('');
    const [editarOAB, setEditarOAB] = useState<string>('');
    const [novaSenha, setNovaSenha] = useState<string>('');
    const [confirmarSenha, setConfirmarSenha] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(false);
    const [fetchingData, setFetchingData] = useState<boolean>(true);
    const [originalData, setOriginalData] = useState<AdvogadoData | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedAdvogadoId = sessionStorage.getItem('advogadoId');
        const storedAuthToken = sessionStorage.getItem('authToken');

        if (storedAdvogadoId && storedAuthToken) {
            setAdvogadoId(storedAdvogadoId);
            setAuthTokenAdvogado(storedAuthToken);
        } else {
            toast.error('Você não está logado como advogado. Por favor, faça login.', toastOptions);
        }
    }, []);

    useEffect(() => {
        const fetchAdvogadoData = async () => {
            if (!advogadoId || !authTokenAdvogado) {
                setFetchingData(false);
                return;
            }

            setFetchingData(true);
            try {
                const response = await axios.get<AdvogadoData>(
                    `https://backendjuriscontrol.onrender.com/api/buscar-advogado-resumido/${advogadoId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authTokenAdvogado}`,
                        },
                    }
                );

                if (response.status === 200) {
                    const { nome, email, registroOAB } = response.data;
                    setEditarNome(nome);
                    setEditarEmail(email);
                    setEditarOAB(registroOAB);
                    setOriginalData(response.data);
                } else {
                    toast.error('Erro ao carregar dados do perfil.', toastOptions);
                }
            } catch (error: any) {
                let errorMessage = 'Erro ao carregar dados do perfil.';
                if (error instanceof AxiosError) {
                    errorMessage = error.response?.data?.message || errorMessage;
                }
                toast.error(errorMessage, toastOptions);
            } finally {
                setFetchingData(false);
            }
        };

        fetchAdvogadoData();
    }, [advogadoId, authTokenAdvogado]);

    const handleUpdatePerfil = async () => {
        if (!advogadoId || !authTokenAdvogado || !originalData) {
            toast.error('Credenciais de advogado não encontradas. Por favor, faça login novamente.', toastOptions);
            return;
        }

        setLoading(true);
        try {
            const updates: Partial<AdvogadoData> = {};
            
            // Só adiciona campos que foram alterados
            if (editarNome !== originalData.nome) updates.nome = editarNome;
            if (editarEmail !== originalData.email) updates.email = editarEmail;
            if (editarOAB !== originalData.registroOAB) updates.registroOAB = editarOAB;

            // Se não há nada para atualizar
            if (Object.keys(updates).length === 0) {
                toast.info('Nenhuma alteração foi feita.', toastOptions);
                return;
            }

            const response = await axios.patch(
                `https://backendjuriscontrol.onrender.com/api/atualiar-advogado-parcial/${advogadoId}`,
                updates,
                {
                    headers: {
                        Authorization: `Bearer ${authTokenAdvogado}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Perfil atualizado com sucesso!', toastOptions);
                sessionStorage.setItem('advogadoNome', editarNome);
                setOriginalData(response.data); // Atualiza os dados originais
            } else {
                toast.error('Erro ao atualizar perfil.', toastOptions);
            }
        } catch (error: any) {
            let errorMessage = 'Erro ao atualizar perfil.';
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            toast.error(errorMessage, toastOptions);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSenha = async () => {
        if (!advogadoId || !authTokenAdvogado) {
            toast.error('Credenciais de advogado não encontradas. Por favor, faça login novamente.', toastOptions);
            return;
        }

        if (!novaSenha || !confirmarSenha) {
            toast.error('Por favor, preencha ambos os campos de senha.', toastOptions);
            return;
        }

        if (novaSenha !== confirmarSenha) {
            toast.error('As senhas não coincidem.', toastOptions);
            return;
        }

        if (novaSenha.length < 6) {
            toast.error('A senha deve ter no mínimo 6 caracteres.', toastOptions);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.patch(
                `https://backendjuriscontrol.onrender.com/api/atualiar-advogado-parcial/${advogadoId}`,
                { senha: novaSenha },
                {
                    headers: {
                        Authorization: `Bearer ${authTokenAdvogado}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Senha atualizada com sucesso!', toastOptions);
                setNovaSenha('');
                setConfirmarSenha('');
            } else {
                toast.error('Erro ao atualizar senha.', toastOptions);
            }
        } catch (error: any) {
            let errorMessage = 'Erro ao atualizar senha.';
            if (error instanceof AxiosError) {
                errorMessage = error.response?.data?.message || errorMessage;
            }
            toast.error(errorMessage, toastOptions);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Carregando perfil...</p>
            </div>
        );
    }

    if (!advogadoId || !authTokenAdvogado) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Acesso negado. Por favor, faça login.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col justify-center items-center bg-gray-100 pt-0">
            <NavBar
                nome="Perfil do usuário"
                botaoVoltar={
                    <Link className="p-0 m-0 flex items-center" href="/inicio">
                        <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
                            <ChevronLeftIcon style={{ width: "35px", height: "35px" }} />
                        </Button>
                    </Link>
                }
            />
            <ToastContainer />
            <Card className="w-full max-w-md">
                <CardHeader className="bg-[#030430] h-14 justify-center text-white rounded-t-lg mb-3">
                    <CardTitle className="text-lg text-center">Meu Perfil</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 p-6">
                    <div>
                        <Label htmlFor="nome">Nome</Label>
                        <Input
                            id="nome"
                            type="text"
                            value={editarNome}
                            onChange={(e) => setEditarNome(e.target.value)}
                            placeholder="Seu nome completo"
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            value={editarEmail}
                            onChange={(e) => setEditarEmail(e.target.value)}
                            placeholder="seuemail@exemplo.com"
                        />
                    </div>

                    <div>
                        <Label htmlFor="oab">Registro OAB</Label>
                        <Input
                            id="oab"
                            type="text"
                            value={editarOAB}
                            onChange={(e) => setEditarOAB(e.target.value)}
                            placeholder="Ex: SP123456"
                        />
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Lock size={16} />
                                Alterar Senha
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Alterar Senha</DialogTitle>
                                <DialogDescription>
                                    Digite sua nova senha nos campos abaixo.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="novaSenha">Nova Senha</Label>
                                    <Input
                                        id="novaSenha"
                                        type="password"
                                        value={novaSenha}
                                        onChange={(e) => setNovaSenha(e.target.value)}
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                                    <Input
                                        id="confirmarSenha"
                                        type="password"
                                        value={confirmarSenha}
                                        onChange={(e) => setConfirmarSenha(e.target.value)}
                                        placeholder="Digite novamente a nova senha"
                                    />
                                </div>
                                <Button
                                    onClick={handleUpdateSenha}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? 'Atualizando...' : 'Confirmar Nova Senha'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button
                        onClick={handleUpdatePerfil}
                        disabled={loading || fetchingData}
                        className="w-full bg-[#030430] hover:bg-[#030430]/90 text-white"
                    >
                        {loading ? 'Atualizando...' : 'Atualizar Perfil'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default withAuth(['advogado'])(Page);