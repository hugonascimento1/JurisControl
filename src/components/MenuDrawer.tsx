import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from '@/components/ui/drawer';
import { Button } from "@/components/ui/button";
import { CalendarDaysIcon, FileTextIcon, FolderOpenIcon, HomeIcon, LogOutIcon, MenuIcon, UserCircle2 } from "lucide-react";

const MenuDrawer = () => {
    const router = useRouter();

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('advogadoNome');
        sessionStorage.removeItem('advogadoEmail');
        sessionStorage.removeItem('advogadoId');
        router.push('/login');
    };

    return (
        <Drawer direction="left">
            <DrawerTrigger asChild>
                <Button className="text-white hover:text-gray-300">
                    <MenuIcon size={28} />
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full bg-[#030430] w-64 mt-0 fixed bottom-0 left-0 rounded-none">
                <DrawerHeader className="p-4  text-white">
                    <DrawerTitle className="text-xl font-bold">Menu Principal</DrawerTitle>
                    <DrawerDescription className="text-gray-300">Navegue pelas funcionalidades</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 flex flex-col gap-4 flex-grow">
                    <DrawerClose asChild>
                        <Link href='/inicio' className="flex items-center gap-3 text-lg font-medium text-white hover:text-gray-500">
                            <HomeIcon className="h-5 w-5" />
                            Início
                        </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Link href='/inicio/processos' className="flex items-center gap-3 text-lg font-medium text-white hover:text-gray-500">
                            <FileTextIcon className="h-5 w-5" />
                            Processos
                        </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Link href='/inicio/agenda' className="flex items-center gap-3 text-lg font-medium text-white hover:text-gray-500">
                            <CalendarDaysIcon className="h-5 w-5" />
                            Agenda
                        </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Link href='/inicio/documentos' className="flex items-center gap-3 text-lg font-medium text-white hover:text-gray-500">
                            <FolderOpenIcon className="h-5 w-5" />
                            Documentos
                        </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                        <Link href='/inicio/perfil' className="flex items-center gap-3 text-lg font-medium text-white hover:text-gray-500">
                            <UserCircle2 className="h-5 w-5" />
                            Perfil
                        </Link>
                    </DrawerClose>
                </div>
                <DrawerFooter className="p-4 border-t border-gray-200">
                    <DrawerClose asChild>
                        <Button 
                            variant='outline'
                            className="w-full text-white bg-red-600 border-red-600 hover:bg-red-800 hover:text-gray-400"
                            onClick={handleLogout}
                        >
                            <LogOutIcon className="h-5 w-5 mr-2" />
                            Sair
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default MenuDrawer;
