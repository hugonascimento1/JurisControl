'use client'

import MyCalendar from "@/components/MyCalendar";
import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment, { locales } from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

const localizer = momentLocalizer(moment);

interface Event {
  titulo: string;
  inicio: Date;
  final: Date;
  descricao: string;
}


export default function Page() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const newEvent = {
  //     title: title,
  //     start: new Date(date),
  //     end: new Date(date),
  //   };
  //   setEvents([...events, newEvent]);
  //   setTitle('');
  //   setDescription('');
  //   setDate('');
  // }

  const [eventos, setEventos] = useState<Event[]>([
    {
      titulo: 'Reunião',
      inicio: new Date(2025, 4, 26, 10, 0),
      final: new Date(2025, 4, 27, 12, 0),
      descricao: 'Reuião com meu cliente sobre o processo dele',
    },
    {
      titulo: 'Almoço',
      inicio: new Date(2025, 4, 29, 12, 0),
      final: new Date(2025, 4, 31, 13, 0),
      descricao: 'Reuião com meu cliente sobre o processo dele',
    },
  ]);

  return (
    <main className="h-screen flex flex-col">
      <NavBar
        botaoVoltar={
          <Link className="p-0 m-0 flex items-center" href="/inicio">
            <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
              <ChevronLeftIcon style={{ width: "35px", height: "35px" }} className=""></ChevronLeftIcon>
            </Button>
          </Link>
        }
        nome="Agenda"
        // botaoAdiconar={
        //   <Button size="icon" variant="outline" className="bg-green-500 hover:bg-green-600">
        //     <Plus className="text-white" />
        //   </Button>
        // }
        botaoMenu

      />

      {/* Carrossel da Agenda */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-2 mx-5 h-full mb-5">
        <Card className="w-full md:w-1/3 bg-gray-200 justify-content-start items-start">
          <CardHeader className="text-center">
            <CardTitle>Adicionar Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 mb-4">
              <Label className="text-base">Título</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="titulo"
              />
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <Label className="text-base">Descrição</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Insira sua descrição."
              />
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <Label className="text-base">Data</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="flex flex-row gap-2 justify-end mt-5">
              <Button type="submit">Salvar</Button>
              <Button
                variant='outline'
                type="button"
                onClick={() => {
                  setTitle('');
                  setDescription('');
                  setDate('');
                }}
              >
                Limpar
              </Button>
            </div>


          </CardContent>
        </Card>

        <Card className="w-full md:w-2/3 h-full">
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 500 }}>
              <Calendar
                localizer={localizer}
                events={eventos}
                startAccessor="inicio"
                endAccessor="final"
                culture="pt-BR"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
