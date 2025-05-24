"use client"

import { Button } from "@/components/ui/button";
import { 
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
    Building,
    FileBarChart, 
    MenuIcon, 
    Percent, 
    Users 
} from "lucide-react";
import ChartOverview from "@/components/chart";
import Advogados from "@/components/advogados";
import NavBar from "@/components/navbar";
import CadastrarAdvogado from "@/components/cadastroAdvogado";
import { useRouter } from "next/navigation";
import { withAuth } from "@/utils/withAuth";

function Page() {

    const router = useRouter();

    const handleClick = () => {
        router.push('/dashboard/advogados')
    };

    return (


        <main>
            {/* <div className="flex w-screen h-50 bg-primary py-5 mb-4">
                <h1 className="text-white font-bold text-xl ml-10">Painel Central</h1>
            </div> */}
            <NavBar 
                nome={"Painel Central"} 
                botaoAdiconar={
                    <CadastrarAdvogado />
                }
                botaoMenu={
                    <Button onClick={handleClick} size="icon" variant="outline" className="bg-[#030430] hover:bg-gray-500">
                        <MenuIcon className="text-white" />
                    </Button>
                } 
            />

            <section className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 m-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-start">
                            <CardTitle className="text-lg sm:text-xl text-primary select-none">Total Processos</CardTitle>
                            <FileBarChart className="ml-auto w-4 h-4" />
                        </div>
                        <CardDescription>
                            Soma total de processos atualizada.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-yellow-600">345</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-start">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">Total Clientes</CardTitle>
                            <Users className="ml-auto w-4 h-4" />
                        </div>
                        <CardDescription>
                            Total de clientes atendidos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-yellow-600">2.500</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-start">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">Casos Solucionados</CardTitle>
                            <Percent className="ml-auto w-4 h-4" />
                        </div>
                        <CardDescription>
                            Total de casos solucionados em %.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-yellow-600">56%</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-start">
                            <CardTitle className="text-lg sm:text-xl text-gray-800 select-none">Câmara Arbitral</CardTitle>
                            <Building className="ml-auto w-4 h-4" />
                        </div>
                        <CardDescription>
                            estatísticas do escritório:
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                            <h1 className="text-xl font-bold text-yellow-600">Rodrigues e Moura advogados associados.</h1>
                    </CardContent>
                </Card>
            </section>

            <section className="mt-4 flex flex-col md:flex-row gap-4 m-2">
                <ChartOverview />
                <Advogados />
            </section>
        </main>
    );
}

export default withAuth(['advogado'])(Page);
