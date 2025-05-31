"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building, FileBarChart, HomeIcon, LogOutIcon, MenuIcon, Percent, UserCog, Users, UsersRoundIcon } from "lucide-react";
import ChartOverview from "@/components/chart/ChartOverview";
import Advogados from "@/app/dashboard/advogados";
import NavBar from "@/components/navbar";
import CadastrarAdvogado from "@/components/cadastroAdvogado";
import { useRouter } from "next/navigation";
import { withAuth } from "@/utils/withAuth";
import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { ChartPieLabelCustom } from "@/components/chart/PieChart";

function Page() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const router = useRouter();

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('administradorNome');
        sessionStorage.removeItem('administradorEmail');
        sessionStorage.removeItem('administradorId');
        router.push('/login');
    }

    const handleClick = () => {
        router.push('/dashboard/advogados')
    };

    return (
        <main className="flex min-h-screen">
            <aside className="w-40 bg-[#030430] text-white flex flex-col p-4 shadow-lg">
                <div className="flex items-center justify-center h-12 border-b border-gray-700">
                    {/* <h2 className="text-xl font-semibold">Meu Painel</h2> */}
                </div>
                <nav className="flex-1 mt-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`w-full flex items-center text-sm p-3 rounded-md transition-colors ${activeTab === "dashboard"
                                    ? "bg-emerald-600 text-white"
                                    : "hover:bg-gray-700 text-gray-200"
                                    }`}
                            >
                                <HomeIcon className="mr-3 h-5 w-5" /> Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab("advogados")}
                                className={`w-full flex items-center text-sm p-3 rounded-md transition-colors ${activeTab === "advogados"
                                    ? "bg-emerald-600 text-white"
                                    : "hover:bg-gray-700 text-gray-200"
                                    }`}
                            >
                                <UsersRoundIcon className="mr-3 h-5 w-5" /> Advogados
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab("administradores")}
                                className={`w-full flex items-center text-sm p-3 rounded-md transition-colors ${activeTab === "administradores"
                                    ? "bg-emerald-600 text-white"
                                    : "hover:bg-gray-700 text-gray-200"
                                    }`}
                            >
                                <UserCog className="mr-3 h-5 w-5" /> Adm
                            </button>
                        </li>
                    </ul>
                </nav>

                <div className="mt-auto pt-4 border-t border-gray-700">
                    <Button
                        // variant='outline'
                        className="w-full bg-transparent flex justify-start items-start hover:bg-gray-700"
                        onClick={handleLogout}
                    >
                        <LogOutIcon className="h-5 w-5 mr-2" />
                        Sair
                    </Button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col bg-gray-100">
                {/* <NavBar nome={"Gerenciamento"} /> */}
                <div className="bg-[#030430] w-full h-16 flex items-center px-4 mb-0">
                    <p className="text-xl font-semibold text-white">Gerenciamento</p>
                </div>

                <div className="flex-1 px-6 py-4">
                    {/* overflow-y-auto */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">

                        {/* Dashboard */}
                        <TabsContent value="dashboard" className="mt-0">
                            <section className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-4 p-0">

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
                            </section>

                            <section className="mt-4 flex flex-col md:flex-row gap-4 m-2">
                                <ChartOverview />
                                <ChartPieLabelCustom />
                                {/* <Advogados /> */}
                            </section>
                        </TabsContent>

                        <TabsContent value="advogados" className="mt-0">
                            <Advogados />
                        </TabsContent>

                        <TabsContent value="administradores" className="mt-0">
                            tabela de administradores
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    );
}

export default withAuth(['administrador'])(Page);
