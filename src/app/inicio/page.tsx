'use client'

import { FileTextIcon, CalendarDaysIcon, FilePlus2, MenuIcon, FolderOpenIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/logo-text-icon";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
    const router = useRouter()

    const handleProcessPage = () => {
        router.push('/inicio/processos');
    }

    const handleAgendaPage = () => {
        router.push('/inicio/agenda')
        // router.push('/agenda')
    }

    const handleModelsPage = () => {
        router.push('/inicio/modelos')
    }
 

    return (
        <main className="min-h-screen pb-10">
            <header className="w-full h-24 bg-[#030430] flex justify-between items-center px-6 shadow-md">
                <div className="flex items-center space-x-3">
                    <Logo />
                </div>
                <button className="text-white hover:text-gray-300">
                    <MenuIcon size={24} />
                </button>
            </header>

            <div className="flex flex-col items-center justify-center mt-6">
                <p className="text-gray-600 text-xl font-bold text-center">
                    Bem-vindo ao JurisControl,
                </p>
                <p className="text-gray-600">[Nome Advogado]</p>
            </div>

            <div className="flex justify-center mt-6 md:w-50 md:h-30">
                <Image
                    src="/logo-escritorio.png"
                    width={426}
                    height={175}
                    alt="logo escritorio"
                />
            </div>


            <div className="flex flex-col items-center justify-center md:flex-row md:space-x-20 space-y-4 md:space-y-0 mt-20 mx-5">
                <Button
                    onClick={handleProcessPage}
                    className="w-3/4 sm:w-60 h-32 sm:h-40 bg-[#030430] text-white flex flex-col items-center justify-center rounded-lg shadow-lg cursor-pointer"
                >
                    <FileTextIcon size={48} />
                    <p className="mt-2 text-lg font-semibold">Processos</p>
                </Button>

                <Button
                    onClick={handleAgendaPage}
                    className="w-3/4 sm:w-60 h-32 sm:h-40 bg-[#030430] text-white flex flex-col items-center justify-center rounded-lg shadow-lg cursor-pointer"
                >
                    <CalendarDaysIcon size={48} />
                    <p className="mt-2 text-lg font-semibold">Agenda</p>
                </Button>

                <Button
                    onClick={handleModelsPage}
                    className="w-3/4 sm:w-60 h-32 sm:h-40 bg-[#030430] text-white flex flex-col items-center justify-center rounded-lg shadow-lg cursor-pointer"
                >
                    <FolderOpenIcon size={48} />
                    <p className="mt-2 text-lg font-semibold">Modelos</p>
                </Button>
            </div>
        </main>
    );
}