'use client'

import { FileTextIcon, CalendarDaysIcon, FilePlus2, MenuIcon, FolderOpenIcon } from "lucide-react";
import Link from "next/link";  
import Image from "next/image";
import Logo from "@/components/logo-text-icon";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";

export default function Page() {
    return (
        <main className="h-screen bg-white">
            <header className="w-full h-24 bg-[#030430] flex justify-between items-center px-6 shadow-md">
                <div className="flex items-center space-x-3">
                    {/* <div className="w-8 h-8 bg-gray-400 rounded-full"></div>  */}
                    {/* <h1 className="text-white font-bold text-xl">JurisControl</h1> */}
                    <Logo />
                </div>
                <button className="text-white hover:text-gray-300">
                    <MenuIcon size={24} />
                </button>
            </header>

            <div className="flex justify-center mt-6">
                <h1 className="text-gray-600 text-2xl font-bold text-center">
                    Bem-vindo ao JurisControl, [Nome Advogado]
                </h1>
            </div>

            <div className="flex justify-center mt-6 md:w-50 md:h-30">
                <Image
                    src="/logo-escritorio.png"
                    width={426}
                    height={175}
                    alt="logo escritorio"
                />
            </div>

            
            <div className="flex flex-col items-center justify-center md:flex-row md:space-x-20 space-y-4 md:space-y-0 mt-20">

                <Link href="inicio/processos"> {/* Adicionando rota para o card de Processos */}
                    <div className="w-60 h-40 bg-[#030430] text-white flex flex-col items-center justify-center rounded-lg shadow-lg cursor-pointer">
                        <FileTextIcon size={48} /> 
                        <p className="mt-2 text-lg font-semibold">Processos</p> 
                    </div>
                </Link>

                <Link href="/agenda"> {/* Adicionando rota para o card de Agenda */}
                    <div className="w-60 h-40 bg-[#030430] text-white flex flex-col items-center justify-center rounded-lg shadow-lg cursor-pointer">
                        <CalendarDaysIcon size={48} /> 
                        <p className="mt-2 text-lg font-semibold">Agenda</p> 
                    </div>
                </Link>

                <Link href="/expediente"> {/* Adicionando rota para o card de Expediente */}
                    <div className="w-60 h-40 bg-[#030430] text-white flex flex-col items-center justify-center rounded-lg shadow-lg cursor-pointer">
                        <FolderOpenIcon size={48} /> 
                        <p className="mt-2 text-lg font-semibold">Modelos</p> 
                    </div>
                </Link>
            </div>
        </main>
    );
}