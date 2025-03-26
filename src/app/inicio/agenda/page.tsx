'use client'

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        // botaoAdiconar={
        //   <Button size="icon" variant="outline" className="bg-green-500 hover:bg-green-600">
        //     <Plus className="text-white" />
        //   </Button>
        // }
        botaoMenu
        botaoVoltar
      />

      {/* Carrossel da Agenda */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 mx-5 h-full mb-5">
        <Card className="w-full md:w-1/3 h-full ">
          <CardHeader className="text-center">
            <CardTitle>Adicionar Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label>Título</Label>
              <Input 
              placeholder="titulo"
              />
            </div>
            
            <div>
              <Label>Descrição</Label>
              <Input 
              placeholder="depóis tenho que trocar pelo componente de textarea"
              />
            </div>
            
            <div>
              <Label>Data</Label>
              <Input
              type="date" 
              placeholder="depóis tenho que trocar pelo componente de textarea"
              />
            </div>

            <div className="flex flex-row gap-2 justify-end mt-5">
              <Button>Salvar</Button>
              <Button variant='outline'>Limpar</Button>
            </div>


          </CardContent>
        </Card>

        <Card className="w-full md:w-2/3 h-full">
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
          </CardHeader>
          <CardContent>
            <h1></h1>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
