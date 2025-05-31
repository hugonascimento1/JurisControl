"use client"

import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { 
    ChartConfig, 
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart";
import { 
    Bar, 
    BarChart, 
    CartesianGrid, 
    XAxis 
} from "recharts";

export default function ChartOverview() {

    const chartData = [
        { month: "Janeiro", processos: 186},
        { month: "Fevereiro", processos: 305 },
        { month: "Março", processos: 237 },
        { month: "Abril", processos: 73 },
        { month: "Maio", processos: 209 },
        { month: "Junho", processos: 214 },
        { month: "Julho", processos: 324 },
        { month: "Agosto", processos: 142 },
        { month: "Setembro", processos: 415 },
        { month: "Outubro", processos: 203 },
        { month: "Novembro", processos: 187 },
        { month: "Dezembro", processos: 109 },
      ]
       
      const chartConfig = {
        processos: {
          label: "Processos",
          color: "#030430",
        },
    } satisfies ChartConfig

    return (
        <Card className="w-full md:w-2/3 md:max-w-[950px]">
            <CardHeader>
                <div className="flex items-center justify-center">
                    <CardTitle className="text-lg sm:text-xl text-primary">Processos por mês</CardTitle>
                    <CalendarDays className="ml-auto w-4 h-4 " />
                </div>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis 
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="processos" fill="var(--color-processos)" radius={4} />
                        {/* <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} /> */}
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}