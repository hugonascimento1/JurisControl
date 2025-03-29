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
  title: string;
  start: Date;
  end: Date;
  description: string;
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
      title: 'Reunião',
      start: new Date(2025, 2, 26, 10, 0),
      end: new Date(2025, 2, 27, 12, 0),
      description: 'Reuião com meu cliente sobre o processo dele',
    },
    {
      title: 'Almoço',
      start: new Date(2025, 2, 29, 12, 0),
      end: new Date(2025, 2, 31, 13, 0),
      description: 'Reuião com meu cliente sobre o processo dele',
    },
  ]);

  return (
    <div className="flex flex-col">
      <NavBar
        botaoVoltar={
          <Link className="p-0 m-0 flex items-center" href="/inicio">
            <Button size="icon" className="bg-[#030430] hover:bg-gray-500">
              <ChevronLeftIcon style={{ width: "35px", height: "35px" }} className=""></ChevronLeftIcon>
            </Button>
          </Link>
        }
        nome="Agenda"
        botaoMenu
      />

      <div className="flex flex-col-reverse md:flex-row justify-center items-center gap-2 mx-5 mt-2 mb-5">
        <Card className="w-full md:w-1/3 flex flex-col h-[610px]">
          <CardHeader className="bg-[#030430] text-white mb-5 rounded-t-lg">
            <CardTitle className="font-semibold">Adicionar Tarefa</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex flex-col gap-2 mb-4">
              <Label className="text-base">Título</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="titulo"
                className="border-gray-300 border-2"
              />
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <Label className="text-base">Data início</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-gray-300 border-2"
              />
            </div>
            
            <div className="flex flex-col gap-2 mb-4">
              <Label className="text-base">Data final</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-gray-300 border-2"
              />
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <Label className="text-base">Descrição</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Insira sua descrição."
                className="border-gray-300 border-2"
              />
            </div>

            <div className="flex flex-row gap-2 justify-end mt-auto">
              <Button
                variant='outline'
                type="button"
                onClick={() => {
                  setTitle('');
                  setDescription('');
                  setDate('');
                }}
                className="border-gray-300 border-2 shadow-md"
              >
                Limpar
              </Button>
              <Button type="submit" className="shadow-md">Salvar</Button>
            </div>


          </CardContent>
        </Card>

        <Card className="w-full md:w-2/3 h-[610px]">
          <CardHeader className="bg-[#030430] text-white mb-5 rounded-t-lg">
            <CardTitle>Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: 500 }}>
              <Calendar
                localizer={localizer}
                events={eventos}
                startAccessor="start"
                endAccessor="end"
                culture="pt-BR"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
