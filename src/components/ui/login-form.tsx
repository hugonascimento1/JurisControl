'use client'

import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function LoginForm() {

    const router = useRouter();

    const handleLogin = () =>  {
        router.push('/inicio');
    }

    return (
        <form action="" className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`mb-3 text-2xl text-center font-normal text-[#030430]`}>
                    <strong>Entrar</strong>
                </h1>
                <div className="w-full">
                    <div>
                        <Label htmlFor="email" className="mb-2 mt-5 block text-lg font-semibold text-gray-900">
                            Email
                        </Label>
                        <div className="relative">
                            <Input 
                                className="peer block w-full rounded-md border-2 border-gray-500 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                type="text"
                                id="cpf"
                                name="cpf"
                                placeholder="Digite seu CPF"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Label htmlFor="password" className="mb-2 mt-5 block text-lg font-semibold text-gray-900">
                            Senha
                        </Label>
                        <div className="relative">
                            <Input 
                                className="peer block w-full rounded-md border-2 border-gray-500 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                type="text" 
                                id="password"
                                name="password"
                                placeholder="Digite sua Senha"
                                required
                                minLength={6}
                            />
                        </div>        
                    </div>
                </div>
                <Button 
                    className="mt-5 text-base w-full h-11 bg-[#030430]"
                    type="submit"
                    onClick={handleLogin}
                >
                    Entrar 
                    <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                </Button>
                <div className="flex h-8 items-end space-x-1">
                    {/* Aqui ficarão as mensagem de erro  */}
                </div>
            </div>
        </form>
    )
}