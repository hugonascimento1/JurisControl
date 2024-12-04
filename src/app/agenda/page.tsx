"use client";

import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Plus } from "lucide-react";

const agendaTarefas = [
  {
    data: "25/11/2024",
    tasks: ["Audiência de Maria Joaquina - 15 horas"],
  },
  {
    data: "26/11/2024",
    tasks: ["Audiência de Hugo - 14 horas"],
  },
  {
    data: "27/11/2024",
    tasks: ["Audiência de Marta - 10 horas"],
  },
  {
    data: "27/11/2024",
    tasks: ["Audiência de Marta - 10 horas"],
  },
];

export default function Page() {
  return (
    <main className="h-screen flex flex-col">
      {/* Barra de navegação */}
      <NavBar
        nome="Agenda"
        botaoAdiconar={
          <Button size="icon" variant="outline" className="bg-green-500 hover:bg-green-600">
            <Plus className="text-white" />
          </Button>
        }
      />

      {/* Carrossel da Agenda */}
      <section className="flex-grow flex justify-center items-center p-4">
        <div className="relative w-full max-w-5xl">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg" />
            <CarouselContent className="flex gap-4">
              {agendaTarefas.map((dia, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2 md:basis-1/3 max-w-sm">
                  <Card className="max-w-sm mx-auto h-48"> {/* Aumentando a altura */}
                    <CardHeader>
                      <CardTitle className="text-lg font-bold text-gray-800">{dia.data}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dia.tasks.map((task, idx) => (
                        <div key={idx} className="text-sm text-gray-600 py-1">
                          {task}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg" />
          </Carousel>
        </div>
      </section>
    </main>
  );
}
