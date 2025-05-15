'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
    Tabs, 
    TabsContent, 
    TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "./tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";

export default function LoginForm() {
    const router = useRouter();
    const [emailAdvogado, setEmailAdvogado] = useState('');
    const [passwordAdvogado, setPasswordAdvogado] = useState('');
    const [errorMessageAdvogado, setErrorMessageAdvogado] = useState('');
    
    const [emailAdmin, setEmailAdmin] = useState('');
    const [passwordAdmin, setPasswordAdmin] = useState('');
    const [errorMessageAdmin, setErrorMessageAdmin] = useState('');

    const handleLoginAdvogado = async () => {
        try {
            const response = await axios.post('https://backendjuriscontrol.onrender.com/api/login/advogado', {
                email: emailAdvogado,
                senha: passwordAdvogado
            });

            if (response.status === 200) {
                sessionStorage.setItem('authToken', response.data.token);
                sessionStorage.setItem('advogadoId', response.data.id);
                console.log('Login de advogado bem-sucedido!');
                window.location.href = '/inicio'
            } else {
                setErrorMessageAdvogado(response.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
                console.error('Erro no login:', response.data);
            }
        } catch (error) {
            setErrorMessageAdvogado('Ocorreu um erro ao tentar fazer login.');
            console.error('Erro na requisição:', error);
        }
    }

    const handleLoginAdmin = async () => {
        try {
            const response = await axios.post('https://backendjuriscontrol.onrender.com/api/login/admin', {
                email: emailAdmin,
                senha: passwordAdmin
            });

            if (response.status === 200) {
                sessionStorage.setItem('authToken', response.data.token);
                sessionStorage.setItem('administradorId', response.data.id);
                console.log('Login de administrador bem-sucedido!');
                window.location.href = '/dashboard';
            } else {
                setErrorMessageAdmin(response.data?.message || 'Erro ao fazer login. verifique suas credenciais.');
                console.error('Erro no login de admin:', response.data);
            }
        } catch (error: any) {
            setErrorMessageAdmin(error.response?.data?.message || 'Ocorreu um erro ao tentar fazer login.');
            console.error('Erro na requisição de login de admin:', error);
        };
    }

    return (
        <div>
            <Tabs defaultValue="loginAdvogado" className="max-w-[400px]">
                <TabsList className="grid w-full grid-cols-2 bg-gray-300 h-12 rounded-lg">
                    <TabsTrigger value="loginAdvogado" className=" data-[state=active]:bg-[#030430] data-[state=active]:text-white text-gray-700 hover:text-gray-900">Advogado</TabsTrigger>
                    <TabsTrigger value="loginAdministrador" className=" data-[state=active]:bg-[#030430] data-[state=active]:text-white text-gray-700 hover:text-gray-900">Administrador</TabsTrigger>
                </TabsList>
                <TabsContent value="loginAdvogado">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-2xl text-[#030430] font-semibold">Login Advogado</CardTitle>
                            {/* <CardDescription>Faça login como administrador</CardDescription> */}
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <Label htmlFor="email" className="mb-2 mt-5 block text-lg font-semibold text-gray-900">
                                    Email
                                </Label>
                                <Input
                                    className="peer block w-full rounded-md border-2 border-gray-500 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Insira seu email"
                                    required
                                    value={emailAdvogado}
                                    onChange={(e) => setEmailAdvogado(e.target.value)}
                                />
                            </div>
                            <div className="">
                                <Label htmlFor="password" className="mb-2 mt-5 block text-lg font-semibold text-gray-900">
                                    Senha
                                </Label>

                                <Input
                                    className="peer block w-full rounded-md border-2 border-gray-500 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                                    type="text"
                                    id="password"
                                    name="password"
                                    placeholder="Insira sua senha"
                                    required
                                    minLength={6}
                                    value={passwordAdvogado}
                                    onChange={(e) => setPasswordAdvogado(e.target.value)}
                                />

                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className=" text-base w-full h-11 bg-[#030430]"
                                type="submit"
                                onClick={handleLoginAdvogado}
                            >
                                Entrar
                                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                            </Button>
                            <div className="flex h-8 items-end space-x-1">
                                {errorMessageAdvogado && <p className="text-red-500 text-sm">{errorMessageAdvogado}</p>}
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="loginAdministrador">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-2xl text-[#030430] font-semibold">Login Admin</CardTitle>
                            {/* <CardDescription>Faça login como administrador</CardDescription> */}
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <Label htmlFor="email" className="mb-2 mt-5 block text-lg font-semibold text-gray-900">
                                    Email
                                </Label>
                                <Input
                                    className="peer block w-full rounded-md border-2 border-gray-500 py-[9px] text-sm outline-2 placeholder:text-gray-500"
                                    type="text"
                                    id="email"
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
                                    id="password"
                                    name="password"
                                    placeholder="Insira sua senha"
                                    required
                                    minLength={6}
                                    value={passwordAdmin}
                                    onChange={(e) => setPasswordAdmin(e.target.value)}
                                />

                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className=" text-base w-full h-11 bg-[#030430]"
                                type="submit"
                                onClick={handleLoginAdmin}
                            >
                                Entrar
                                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                            </Button>
                            <div className="flex h-8 items-end space-x-1">
                                {/* Aqui ficarão as mensagem de erro  */}
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

        </div>

    )
}