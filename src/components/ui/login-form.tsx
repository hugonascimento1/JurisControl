import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
    return (
        <form action="" className="space-y-3">
            <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
                <h1 className={`mb-3 text-2xl text-center text-[#030430]`}>
                    <strong>Entrar</strong>
                </h1>
                <div className="w-full">
                    <div>
                        <Label htmlFor="cpf" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                            CPF
                        </Label>
                        <div className="relative">
                            <Input 
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                type="text"
                                id="cpf"
                                name="cpf"
                                placeholder="Digite seu CPF"
                                required
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Label htmlFor="password" className="mb-3 mt-5 block text-xs font-medium text-gray-900">
                            Senha
                        </Label>
                        <div className="relative">
                            <Input 
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
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
                <Button className="mt-4 w-full bg-[#030430]">
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