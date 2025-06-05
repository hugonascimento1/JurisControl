'use client'

import { FileTextIcon, CalendarDaysIcon, FilePlus2, MenuIcon, FolderOpenIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/logo-text-icon";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { withAuth } from "@/utils/withAuth";
import MenuDrawer from "@/components/MenuDrawer";

function Page() {
    const router = useRouter();
    const [advogadoNome, setAdvogadoNome] = useState<string | null>(null);

    useEffect(() => {
        setAdvogadoNome(sessionStorage.getItem('advogadoNome'));
    }, []);

    const handleProcessPage = () => {
        router.push('/inicio/processos');
    }

    const handleAgendaPage = () => {
        router.push('/inicio/agenda')
        // router.push('/agenda')
    }

    const handleModelsPage = () => {
        router.push('/inicio/documentos')
    }


    return (
        <main className="min-h-screen flex flex-col"> {/* Tornamos a main um flex container de coluna */}
            <header className="w-full h-20 bg-[#030430] flex justify-between items-center px-6 shadow-md">
                <div className="flex items-center space-x-3">
                    <Logo />
                </div>
                <MenuDrawer />
            </header>

            {/* O conteúdo do topo (Boas-vindas e Logo) */}
            <div className="flex flex-col items-center mt-4">
                <p className="text-gray-600 text-xl font-bold text-center lg:text-2xl ">
                    Bem-vindo ao JurisControl,
                </p>
                <p className="text-gray-600 lg:text-xl">{advogadoNome}</p>
            </div>

            <div className="flex justify-center my-4">
                <Image
                    className=""
                    src="/logo-escritorio.png"
                    width={426}
                    height={175}
                    alt="logo escritorio"
                />
            </div>

            {/* Este é o container dos botões que será centralizado verticalmente */}
            <div className="flex-grow flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-20 md:space-y-0 mx-5">
                <Button
                    onClick={handleProcessPage}
                    className="w-3/4 sm:w-60 h-32 sm:h-40 bg-[#030430] text-white flex flex-col items-center justify-center rounded-lg shadow-lg cursor-pointer"
                >
                    <FileTextIcon size={48} className="w-12 h-12" />
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
                    <p className="mt-2 text-lg font-semibold">Documentos</p>
                </Button>
            </div>
        </main>
    );
}

export default withAuth(['advogado'])(Page);