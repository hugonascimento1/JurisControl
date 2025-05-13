'use client'

import React, { useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { TabsList } from "./tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('https://backendjuriscontrol.onrender.com/auth/login/advogado', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('authToken', data.token);
                console.log('Login bem-sucedido!');
                window.location.href = '/inicio'
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Erro ao fazer login. Verifique suas credenciais.');
                console.error('Erro no login:', errorData);
            }
        } catch (error) {
            setErrorMessage('Ocorreu um erro ao tentar fazer login.');
            console.error('Erro na requisição:', error);
        }
    }

    return (
        <div>
            <Tabs defaultValue="loginAdvogado" className="w-[400px]">
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
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className=" text-base w-full h-11 bg-[#030430]"
                                type="submit"
                                onClick={handleLogin}
                            >
                                Entrar
                                <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                            </Button>
                            <div className="flex h-8 items-end space-x-1">
                                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
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
                                />

                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className=" text-base w-full h-11 bg-[#030430]"
                                type="submit"
                                onClick={handleLogin}
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