'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import { toast, ToastContainer, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginForm() {
    const router = useRouter();
    const [emailAdvogado, setEmailAdvogado] = useState('');
    const [passwordAdvogado, setPasswordAdvogado] = useState('');
    const [isLoggingInAdvogado, setIsLoggingAdvogado] = useState(false);
    
    const [emailAdmin, setEmailAdmin] = useState('');
    const [passwordAdmin, setPasswordAdmin] = useState('');
    const [isLoggingInAdmin, setIsLoggingAdmin] = useState(false);

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

    const handleLoginAdvogadoSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoggingAdvogado(true)
        try {
            const response = await axios.post('https://backendjuriscontrol.onrender.com/api/login/advogado', {
                email: emailAdvogado,
                senha: passwordAdvogado
            });

            if (response.status === 200) {
                sessionStorage.setItem('authToken', response.data.token);
                sessionStorage.setItem('tipoUsuario', response.data.tipoUsuario);
                sessionStorage.setItem('advogadoId', response.data.id);
                sessionStorage.setItem('advogadoNome', response.data.nome);
                toast.success(`Bem-vindo(a), ${response.data.nome}!`, toastOptions);
                console.log('Login de advogado bem-sucedido!');
                router.push('/inicio')
            } else {
                let errorMessage = 'Ocorreu um erro ao fazer login.';
                if (response.data?.message) {
                    errorMessage = response.data.message;
                } else if (response.status === 401) {
                    errorMessage = 'Verifique se o email e a senha estão corretos.'
                }
               toast.error(errorMessage, toastOptions);
                console.error('Erro no login:', response.data);
            }
        } catch (error: any) {
            let errorMessage = 'Ocorreu um erro ao tentar fazer login. Tente mais tarde.';
             if (error.response?.status === 401) {
                errorMessage = 'Verifique se o email e a senha estão corretos.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage, toastOptions);
            console.error('Erro na requisição:', error);
        } finally {
            setIsLoggingAdvogado(false)
        }
    }

    const handleLoginAdminSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoggingAdmin(true);
        try {
            const response = await axios.post('https://backendjuriscontrol.onrender.com/api/login/admin', {
                email: emailAdmin,
                senha: passwordAdmin
            });

            if (response.status === 200) {
                sessionStorage.setItem('authToken', response.data.token);
                sessionStorage.setItem('tipoUsuario', response.data.tipoUsuario);
                sessionStorage.setItem('administradorId', response.data.id);
                sessionStorage.setItem('administradorNome', response.data.nome);
                toast.success('Login de administrador bem-sucedido!', toastOptions);
                console.log('Login de administrador bem-sucedido!');
                router.push('/dashboard')
            } else {
                let errorMessage = 'Ocorreu um erro ao fazer login.';
                if (response.data?.message) {
                    errorMessage = response.data.message;
                } else if (response.status === 401) {
                    errorMessage = 'Verifique se o email e a senha estão corretos.'
                }
               toast.error(errorMessage, toastOptions);
                console.error('Erro no login de admin:', response.data);
            }
        } catch (error: any) {
            let errorMessage = 'Ocorreu um erro ao tentar fazer login. Tente mais tarde.';
             if (error.response?.status === 401) {
                errorMessage = 'Verifique se o email e a senha estão corretos.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage, toastOptions);
            console.error('Erro na requisição de login de admin:', error);
        } finally {
            setIsLoggingAdmin(false);
        }
    };

    return (
        <div>
            <ToastContainer />
            <Tabs defaultValue="loginAdvogado" className="max-w-[400px]">
                <TabsList className="grid w-full grid-cols-2 bg-gray-300 h-12 rounded-lg">
                    <TabsTrigger value="loginAdvogado" className=" data-[state=active]:bg-[#030430] data-[state=active]:text-white text-gray-700 hover:text-gray-900">Advogado</TabsTrigger>
                    <TabsTrigger value="loginAdministrador" className=" data-[state=active]:bg-[#030430] data-[state=active]:text-white text-gray-700 hover:text-gray-900">Administrador</TabsTrigger>
                </TabsList>
                <TabsContent value="loginAdvogado">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-2xl text-[#030430] font-semibold">Login Advogado</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <form onSubmit={handleLoginAdvogadoSubmit}>
                                <div>
                                    <Label htmlFor="emailAdvogado" className="mb-2 mt-5 block text-lg font-semibold text-gray-900">
                                        Email
                                    </Label>
                                    <Input
                                        className="peer block w-full rounded-md border-2 border-gray-500 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                                        type="text"
                                        id="emailAdvogado"
                                        name="email"
                                        placeholder="Insira seu email"
                                        required
                                        value={emailAdvogado}
                                        onChange={(e) => setEmailAdvogado(e.target.value)}
                                    />
                                </div>
                                <div className="">
                                    <Label htmlFor="passwordAdvogado" className="mb-2 mt-5 block text-lg font-semibold text-gray-900">
                                        Senha
                                    </Label>
                                    <Input
                                        className="peer block w-full rounded-md border-2 border-gray-500 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                                        type="text"
                                        id="passwordAdvogado"
                                        name="password"
                                        placeholder="Insira sua senha"
                                        required
                                        minLength={6}
                                        value={passwordAdvogado}
                                        onChange={(e) => setPasswordAdvogado(e.target.value)}
                                    />
                                </div>
                                    <Button
                                        className=" text-base w-full h-11 bg-[#030430] mt-4"
                                        type="submit"
                                        disabled={isLoggingInAdvogado}
                                    >
                                        {isLoggingInAdvogado ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <>
                                                Entrar
                                                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                                            </>
                                        )}
                                    </Button>
                            </form>    
                        </CardContent>
                        
                    </Card>
                </TabsContent>

                <TabsContent value="loginAdministrador">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-2xl text-[#030430] font-semibold">Login Admin</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <form onSubmit={handleLoginAdminSubmit}>
                                <div>
                                    <Label htmlFor="email" className="mb-2 mt-5 block text-lg font-semibold text-gray-900">
                                        Email
                                    </Label>
                                    <Input
                                        className="peer block w-full rounded-md border-2 border-gray-500 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                                        type="text"
                                        id="emailAdmin"
                                        name="email"
                                        placeholder="Insira seu email"
                                        required
                                        value={emailAdmin}
                                        onChange={(e) => setEmailAdmin(e.target.value)}
                                    />
                                </div>
                                <div className="">
                                    <Label htmlFor="password" className="mb-2 mt-5 block text-lg font-semibold text-gray-900">
                                        Senha
                                    </Label>
                                    <Input
                                        className="peer block w-full rounded-md border-2 border-gray-500 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                                        type="text"
                                        id="passwordAdmin"
                                        name="password"
                                        placeholder="Insira sua senha"
                                        required
                                        minLength={6}
                                        value={passwordAdmin}
                                        onChange={(e) => setPasswordAdmin(e.target.value)}
                                    />
                                </div>
                                    <Button
                                        className=" text-base w-full h-11 bg-[#030430] mt-4"
                                        type="submit"
                                        disabled={isLoggingInAdmin}
                                    >
                                        {isLoggingInAdmin ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <>
                                                Entrar
                                                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                                            </>
                                        )}
                                    </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}