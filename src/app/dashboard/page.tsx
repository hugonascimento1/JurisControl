"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Building, FileBarChart, HomeIcon, LogOutIcon, MenuIcon, Percent, Scale, UserCog, Users, UsersRoundIcon } from "lucide-react";
import ChartOverview from "@/components/chart/ChartOverview";
import Advogados from "@/app/dashboard/advogados";
import NavBar from "@/components/navbar";
import CadastrarAdvogado from "@/components/cadastroAdvogado";
import { useRouter } from "next/navigation";
import { withAuth } from "@/utils/withAuth";
import { useCallback, useEffect, useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { ChartPieLabelCustom } from "@/components/chart/PieChart";
import Logo from "@/components/logo-text-iconw";
import Administradores from "@/app/dashboard/administradores";
import Image from "next/image";

function Page() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const router = useRouter();
    const admNome = sessionStorage.getItem('administradorNome');

    // Estados para armazenar os totais do backend
    const [totalProcessos, setTotalProcessos] = useState<number | null>(null);
    const [totalAdvogados, setTotalAdvogados] = useState<number | null>(null);

    // Estado para o token de autenticação
    const [authTokenAdm, setAuthTokenAdm] = useState<string | null>(null);

    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            setAuthTokenAdm(token);
        } else {
            router.push('/login')
        }
    }, [router]);

    // Função para buscar os dados do backend
    const fetchDashboardData = useCallback(async () => {
        if (!authTokenAdm) {
            console.warn('Token de autenticação não disponível. Não foi possível buscar dados do dashboard.');
            return;
        }

        const headers = {
            'Authorization': `Bearer ${authTokenAdm}`,
            'Content-Type': 'application/json'
        };

        try {
            // Fetch Total Processos
            const processosResponse = await fetch('https://backendjuriscontrol.onrender.com/api/dashboard/total-processos', { headers });
            if (processosResponse.ok) {
                const data = await processosResponse.json();
                setTotalProcessos(data.totalProcessos);
            } else {
                console.error('Erro ao buscar total de processos:', processosResponse.status, processosResponse.statusText);
                setTotalProcessos(0);
                if (processosResponse.status === 401 || processosResponse.status === 403) {
                    router.push('/login');
                }
            }

            // Fetch Total Advogados
            const advogadosResponse = await fetch('https://backendjuriscontrol.onrender.com/api/dashboard/total-advogados', { headers });
            if (advogadosResponse.ok) {
                const data = await advogadosResponse.json();
                setTotalAdvogados(data.totalAdvogados);
            } else {
                console.error('Erro ao buscar total de advogados:', advogadosResponse.status, advogadosResponse.statusText);
                setTotalAdvogados(0);
                if (advogadosResponse.status === 401 || advogadosResponse.status === 403) {
                    router.push('/login');
                }
            }

        } catch (error) {
            console.error('Erro de rede ao buscar dados do dashboard:', error);
            setTotalProcessos(0);
            setTotalAdvogados(0);
        }
    }, [authTokenAdm, router]);

    // 3. Efeito para chamar a função de busca de dados inicialmente E periodicamente
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (authTokenAdm) {
            fetchDashboardData();

            // Configura o intervalo para chamar a função a cada 5 segundos (5000 ms)
            intervalId = setInterval(() => {
                console.log("Atualizando dados do dashboard automaticamente...");
                fetchDashboardData();
            }, 5000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [authTokenAdm, fetchDashboardData]);

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
            {/* Asidebar permanece como está, pois funciona bem */}
            <aside className="w-40 bg-[#030430] text-white flex flex-col p-4 shadow-lg">
                <div className="flex items-center justify-center h-12 border-b border-gray-700">
                    {/* Conteúdo do logo ou título do sidebar */}
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
                        className="w-full bg-transparent flex justify-start items-start hover:bg-gray-700"
                        onClick={handleLogout}
                    >
                        <LogOutIcon className="h-5 w-5 mr-2" />
                        Sair
                    </Button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col bg-gray-100">
                <div className="bg-[#030430] w-full h-16 flex items-center justify-between px-4 mb-0">
                    <p className="text-xl font-semibold text-white">Gerenciamento</p>
                    <p className="text-white flex flex-row gap-2 bg-gray-700 p-1">
                        <UserCog /> {admNome}
                    </p>
                </div>

                {/* Este div flex-1 vai garantir que o conteúdo principal ocupe o restante da altura */}
                {/* Remova o overflow-y-auto daqui se quiser que a rolagem aconteça dentro do TabsContent */}
                <div className="flex-1 px-6 py-4"> {/* Removi overflow-y-auto aqui */}
                    {/* Adicionei w-full e removemos h-full, pois o conteúdo vai definir a altura */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col h-full">
                        {/* Dashboard */}
                        {/* Mantive flex-1 e flex-col aqui, pois os gráficos já estavam funcionando bem */}
                        <TabsContent value="dashboard" className="mt-0 flex-1 flex flex-col">
                            <section className="grid lg:grid-cols-3 md:grid-cols-3 grid-cols-1 sm:grid-cols-2 gap-4 p-0">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-start">
                                            <CardTitle className="text-lg sm:text-xl text-[#030430] select-none">
                                                Total Processos
                                            </CardTitle>
                                            <FileBarChart className="ml-auto w-4 h-4" />
                                        </div>
                                        <CardDescription>
                                            Total de processos cadastrados.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold text-yellow-600">
                                            {totalProcessos}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-start">
                                            <CardTitle className="text-lg sm:text-xl text-[#030430] select-none">
                                                Total Advogados
                                            </CardTitle>
                                            <Users className="ml-auto w-4 h-4" />
                                        </div>
                                        <CardDescription>
                                            Total de advogados cadastrados.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-3xl font-bold text-yellow-600">
                                            {totalAdvogados}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="flex items-center justify-center p-4">
                                    <Image
                                        className="max-w-full h-auto"
                                        src="/logo-escritorio.png"
                                        width={426}
                                        height={175}
                                        alt="logo escritorio"
                                    />
                                </Card>
                            </section>

                            <section className="mt-4 flex-1 flex flex-col lg:flex-row gap-4">
                                <ChartOverview />
                                <ChartPieLabelCustom />
                            </section>
                        </TabsContent>

                        {/* Advogados */}
                        {/* Adicionado w-full para garantir que a aba ocupe toda a largura */}
                        <TabsContent value="advogados" className="mt-1 w-full h-full overflow-auto"> {/* Adicionei w-full e overflow-auto */}
                            <Advogados />
                        </TabsContent>

                        {/* Administradores */}
                        {/* Adicionado w-full para garantir que a aba ocupe toda a largura */}
                        <TabsContent value="administradores" className="mt-1 w-full h-full overflow-auto"> {/* Adicionei w-full e overflow-auto */}
                            <Administradores />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
    );
}

export default withAuth(['administrador'])(Page);
