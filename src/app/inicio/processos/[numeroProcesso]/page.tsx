'use client';

import { useParams } from "next/navigation"; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import NavBar from "@/components/navbar";

export default function Page() {
    const params = useParams(); // Captura os parâmetros da URL
    const numeroProcesso = params.numeroProcesso; // Pega o número do processo da URL

    return (
        <div className="justify-center items-center">
            <NavBar
                nome="Detalhes do Processo"
                botaoVoltar={
                    <Link className="p-0 m-0 flex items-center" href="/inicio/processos">
                        <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
                            <ChevronLeftIcon style={{ width: "35px", height: "35px" }} />
                        </Button>
                    </Link>
                }
            />

            <div className="p-5 flex flex-col justify-center items-center bg-black gap-2 sm:flex-row h-auto">
                <Card className="w-full md:w-1/3 h-[600px]">
                    <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
                        <CardTitle className="text-lg">Movimentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Aqui vão os detalhes do movimento...</p>
                    </CardContent>
                </Card>

                <Card className="w-full md:w-2/3 h-[600px]">
                    <CardHeader className="bg-[#030430] justify-center h-14 rounded-t-lg text-white items-start">
                        <CardTitle className="text-lg">Processo N° {numeroProcesso}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Detalhes do processo {numeroProcesso}...</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
