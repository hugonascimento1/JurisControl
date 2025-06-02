// "use client"

// import { TrendingUp } from "lucide-react"
// import { Pie, PieChart } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"

// export const description = "A pie chart with a custom label"

// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 90, fill: "var(--color-other)" },
// ]

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "Chrome",
//     color: "var(--chart-1)",
//   },
//   safari: {
//     label: "Safari",
//     color: "var(--chart-2)",
//   },
//   firefox: {
//     label: "Firefox",
//     color: "var(--chart-3)",
//   },
//   edge: {
//     label: "Edge",
//     color: "var(--chart-4)",
//   },
//   other: {
//     label: "Other",
//     color: "var(--chart-5)",
//   },
// } satisfies ChartConfig

// export function ChartPieLabelCustom() {
//   return (
//     <Card className="flex flex-col w-1/3 h-auto">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Processos por Status</CardTitle>
//         {/* <CardDescription>January - June 2024</CardDescription> */}
//       </CardHeader>
//       <CardContent className="flex-1 pb-0 justify-center items-center">
//         <ChartContainer
//           config={chartConfig}
//           className="mx-auto aspect-square px-0 flex justify-center items-center"
//         >
//           <PieChart>
//             <ChartTooltip
//               content={<ChartTooltipContent nameKey="visitors" hideLabel />}
//             />
//             <Pie
//               data={chartData}
//               dataKey="visitors"
//               labelLine={false}
//               label={({ payload, ...props }) => {
//                 return (
//                   <text
//                     cx={props.cx}
//                     cy={props.cy}
//                     x={props.x}
//                     y={props.y}
//                     textAnchor={props.textAnchor}
//                     dominantBaseline={props.dominantBaseline}
//                     fill="hsla(var(--foreground))"
//                   >
//                     {payload.visitors}
//                   </text>
//                 )
//               }}
//               nameKey="browser"
//             />
//           </PieChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Loader2 } from "lucide-react";
import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { useRouter } from 'next/navigation';
// Definição da interface para os dados que virão do backend
interface ProcessosPorStatusData {
  status: string;
  quantidade: number;
  fill: string;
}


export function ChartPieLabelCustom() {
  const [chartData, setChartData] = useState<ProcessosPorStatusData[]>([]);
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

  const fetchProcessosPorStatus = useCallback(async () => {
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
      const response = await fetch('https://backendjuriscontrol.onrender.com/api/dashboard/processos-por-status', {
        headers: {
          'Authorization': `Bearer ${authTokenAdm}`,
          // 'Accept': '*/*'
        }
      });

      if (response.ok) {
        const data: ProcessosPorStatusData[] = await response.json();
        const colors = ['#00FF00', '#0000CC', '#808080'];
        const dataWithColors = data.map((item, index) => ({
          ...item,
          fill: colors[index % colors.length] // Cicla pelas cores
        }));
        setChartData(dataWithColors);
        setError(null);
      } else {
        const errorText = await response.text();
        console.error('Erro ao buscar dados do gráfico de processos por status:', response.status, errorText);
        setError(`Erro ao carregar dados: ${response.statusText}. Detalhes: ${errorText.substring(0, 100)}...`);
      }
    } catch (err) {
      console.error('Erro de rede ao buscar dados do gráfico:', err);
      setError('Erro de rede ao carregar dados. Verifique a conexão ou o servidor.');
    } finally {
      setIsLoadingInitial(false);
      setIsRefreshing(false);
    }
  }, [authTokenAdm, chartData.length, isLoadingInitial]); // Dependências do useCallback

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (authTokenAdm) {
      fetchProcessosPorStatus();

      intervalId = setInterval(() => {
        console.log("Atualizando dados do gráfico de processos por status automaticamente...");
        fetchProcessosPorStatus();
      }, 5000); // A cada 5 segundos
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [authTokenAdm, fetchProcessosPorStatus]);

  
  const dynamicChartConfig: ChartConfig = chartData.reduce((acc, item, index) => {
    const varName = `chart-${index + 1}`;
    acc[item.status] = {
      label: `${item.status} ${item.quantidade}`,
      color: `var(--${varName}, ${item.fill})` // Usa a cor definida no item.fill
    };
    return acc;
  }, {
    quantidade: { label: "Quantidade", color: "hsl(var(--primary))" } // Configuração padrão para a quantidade
  } as ChartConfig);

  // Adiciona as variáveis CSS dinâmicas ao documento para as cores
  useEffect(() => {
    chartData.forEach((item, index) => {
      document.documentElement.style.setProperty(`--chart-${index + 1}`, item.fill || 'transparent');
    });
  }, [chartData]);


  return (
    <Card className="flex flex-col w-full md:w-1/3 h-auto"> {/* Ajuste a largura para caber no layout */}
      <CardHeader className="items-center pb-0">
        <div className="flex items-center w-full justify-between pr-4"> {/* Ajuste para espaçamento */}
          <CardTitle className="text-lg sm:text-xl text-primary">Processos por Status</CardTitle>
          <div className="flex items-center gap-2">
            {isRefreshing && (
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            )}
            <TrendingUp className="h-4 w-4" /> {/* Ícone para este gráfico */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-0 justify-center items-center">
        {isLoadingInitial && (
          <div className="flex justify-center items-center h-[200px] text-gray-600">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <p>Carregando dados do gráfico...</p>
          </div>
        )}
        {!isLoadingInitial && error && chartData.length === 0 && (
          <div className="flex justify-center items-center h-[200px] text-red-600"><p>{error}</p></div>
        )}
        {!isLoadingInitial && !error && chartData.length === 0 && (
          <div className="flex justify-center items-center h-[200px] text-gray-500"><p>Nenhum dado de processo por status encontrado para exibir.</p></div>
        )}
        {chartData.length > 0 && (
          <ChartContainer
            config={dynamicChartConfig} // Usa a configuração dinâmica
            className="mx-auto aspect-square px-0 flex justify-center items-center"
          >
            <PieChart>
              <ChartTooltip
                content={<ChartTooltipContent nameKey=" " hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="quantidade" // Usa a chave 'quantidade' do backend
                labelLine={false}
                label={({ payload, ...props }) => {
                  return (
                    <text
                      cx={props.cx}
                      cy={props.cy}
                      x={props.x}
                      y={props.y}
                      textAnchor={props.textAnchor}
                      dominantBaseline={props.dominantBaseline}
                      fill="hsl(var(--foreground))"
                    >
                      {`${payload.quantidade}`} {/* Exibe a quantidade */}
                    </text>
                  );
                }}
                nameKey="status" // Usa a chave 'status' para o nome da fatia
              />
              <ChartLegend 
                content={<ChartLegendContent nameKey='status' />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/3 *:justify-start"
              />
            </PieChart>
          </ChartContainer>
        )}
        {chartData.length > 0 && error && (
          <div className="text-sm text-red-500 mt-2 text-center">
            <p>Falha ao atualizar: {error}</p>
          </div>
        )}
      </CardContent>
      {/* Opcional: Adicionar um CardFooter para exibir uma porcentagem geral ou tendência */}
      {/* <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Based on data from January to June 2024
                </div>
            </CardFooter> */}
    </Card>
  );
}