"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Loader2 } from "lucide-react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { useCallback, useEffect, useState } from "react";
import router, { useRouter } from "next/navigation";

interface ProcessosPorAdvogadoData {
    advogadoNome: string;
    quantidadeProcessos: number;
}


export default function ChartOverview() {
    const [chartData, setChartData] = useState<ProcessosPorAdvogadoData[]>([]);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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

    const fetchProcessosPorAdvogado = useCallback(async () => {
        if (!authTokenAdm) {
            setError('Token de autenticação não disponível.');
            if (isLoadingInitial) setIsLoadingInitial(false);
            return;
        }

        if (chartData.length > 0) {
            setIsRefreshing(true);
        }
        setError(null);
        try {
            const response = await fetch('https://backendjuriscontrol.onrender.com/api/dashboard/processos-por-advogado', {
                headers: {
                    'Authorization': `Bearer ${authTokenAdm}`,
                    // 'Accept': '*/*' // Conforme seu curl, embora application/json seja mais comum para APIs
                }
            });

            if (response.ok) {
                const data: ProcessosPorAdvogadoData[] = await response.json();
                setChartData(data);
                setError(null);
            } else {
                const errorText = await response.text();
                console.error('Erro ao buscar dados do gráfico de processos por advogado:', response.status, errorText);
                setError(`Erro ao carregar dados: ${response.statusText}. Detalhes: ${errorText.substring(0, 100)}...`);
                // setChartData([]); // Limpa os dados em caso de erro
            }
        } catch (err) {
            console.error('Erro de rede ao buscar dados do gráfico:', err);
            setError('Erro de rede ao carregar dados. Verifique a conexão ou o servidor.');
            // setChartData([]);
        } finally {
            setIsLoadingInitial(false);
            setIsRefreshing(false);
        }
    }, [authTokenAdm, chartData.length, isLoadingInitial]); // Depende do token

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (authTokenAdm) {
            // Chama a função imediatamente no carregamento inicial
            fetchProcessosPorAdvogado();

            // Configura o intervalo para chamar a função periodicamente
            intervalId = setInterval(() => {
                console.log("Atualizando dados do gráfico de processos por advogado automaticamente...");
                fetchProcessosPorAdvogado();
            }, 5000); // A cada 10 segundos
        }

        // Limpa o intervalo quando o componente é desmontado ou o token muda
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [authTokenAdm, fetchProcessosPorAdvogado]);

    const chartConfig = {
        quantidadeProcessos: {
            label: "Processos",
            color: "#030430",
        },
    } satisfies ChartConfig;

    return (
        <Card className="w-full md:w-2/3">
            <CardHeader>
                <div className="flex items-center justify-center">
                    <CardTitle className="text-lg sm:text-xl text-primary">Processos por Advogado</CardTitle>
                    <CalendarDays className="ml-auto w-4 h-4 " />
                </div>
            </CardHeader>

            <CardContent>
                {isLoadingInitial && ( // Mostra "Carregando..." apenas no primeiro load
                    <div className="flex justify-center items-center h-[200px] text-gray-600">
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        <p>Carregando dados do gráfico...</p>
                    </div>
                )}
                {!isLoadingInitial && error && chartData.length === 0 && ( // Mostra erro se for o primeiro load E houver erro
                    <div className="flex justify-center items-center h-[200px] text-red-600"><p>{error}</p></div>
                )}
                {!isLoadingInitial && !error && chartData.length === 0 && ( // Mostra "Nenhum dado" se for o primeiro load e não houver dados
                    <div className="flex justify-center items-center h-[200px] text-gray-500"><p>Nenhum dado de processo por advogado encontrado para exibir.</p></div>
                )}
                {/* Sempre renderiza o gráfico se houver dados, independente do estado de carregamento */}
                {chartData.length > 0 && (
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <BarChart data={chartData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="advogadoNome"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value: string) => {
                                    const maxLength = 10;
                                    return value.length > maxLength ? value.slice(0, maxLength) + '...' : value;
                                }}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar
                                dataKey="quantidadeProcessos"
                                fill="var(--color-quantidadeProcessos)"
                                radius={4}
                            />
                        </BarChart>
                    </ChartContainer>
                )}
                {/* Se houver dados antigos e um erro durante o refresh, mostra o erro abaixo do gráfico */}
                {chartData.length > 0 && error && (
                    <div className="text-sm text-red-500 mt-2 text-center">
                        <p>Falha ao atualizar: {error}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}