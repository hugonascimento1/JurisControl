import React from "react"
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';
import { EventContentArg } from "@fullcalendar/core/index.js";
import { on } from "events";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { FileText } from 'lucide-react';

interface AgendaTarefa {
  id: number;
  titulo: string;
  descricao: string;
  data: Date;
  advogadoId: number;
}

interface FullCalendarioProps {
    tarefas: AgendaTarefa[];
    onSelectTarefa: (tarefa: AgendaTarefa) => void;
}

export function FullCalendario({ tarefas, onSelectTarefa }: FullCalendarioProps) {
    const events = tarefas.map((tarefa) => ({
        id: String(tarefa.id),
        title: tarefa.titulo,
        start: tarefa.data,
        end: tarefa.data, // Se for tarefa de um único dia
        extendedProps: {
            description: tarefa.descricao,
            advogadoId: tarefa.advogadoId,
        },
    }));

    // Função que renderiza o conteúdo da TAREFA
    function renderEventContent(eventInfo: EventContentArg) {
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <Dialog>
                            <DialogTrigger>
                                {/* <div style={{ backgroundColor: 'white' }}>
                                    <b className="text-black">{eventInfo.event.title}</b>
                                    <p className="text-black whitespace-break-spaces">{eventInfo.event.extendedProps.description}</p>
                                    <p className="text-black">{eventInfo.event.start ? formatDate(eventInfo.event.start.toISOString()) : 'N/A'}</p>
                                </div> */}
                                <div>
                                    <FileText />
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Editar Tarefa</DialogTitle>
                                </DialogHeader>
                                    <form onSubmit={(e) => e.preventDefault()}>
                                        <div className="flex flex-col space-y-2 p-2">
                                            <Label className="text-base">Título:</Label>
                                            <Input
                                                type="text"
                                                defaultValue={eventInfo.event.title}
                                                className="border-gray-300 border-2"
                                            />
                                            <Label className="text-base">Data:</Label>
                                            <Input
                                                type="date"
                                                defaultValue={eventInfo.event.start ? formatDate(eventInfo.event.start.toISOString()) : 'N/A'}
                                                className="border-gray-300 border-2"
                                            />
                                            <Label className="text-base">Descrição:</Label>
                                            <Textarea
                                                defaultValue={eventInfo.event.extendedProps.description}
                                                className="border-gray-300 border-2 w-full flex-grow"
                                            />
                                        </div>
                                    </form>
                                <DialogFooter>
                                    <Button className="mt-4" type="submit">Editar</Button>
                                    <Dialog>
                                        <DialogTrigger>
                                            <Button className="mt-4" >Excluir</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Confirmar Exclusão</DialogTitle>
                                            <DialogDescription>
                                                Tem certeza que deseja excluir este processo e todos os seus anexos e movimentos?
                                            </DialogDescription>
                                            <Button variant="outline">Cancelar</Button>
                                            <Button
                                                variant="destructive"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                Confirmar Exclusão
                                            </Button>
                                        </DialogContent>
                                    </Dialog>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                        <b className="text-black">{eventInfo.event.title}</b>
                        <p className="text-black whitespace-break-spaces">{eventInfo.event.extendedProps.description}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    // Função que formata a data para o padrão brasileiro
    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            //hour: '2-digit',
            //minute: '2-digit',
        };
        return date.toLocaleDateString('pt-BR', options);
    }


    return (
        <div style={{ height: '100%' }}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                locale={'pt'}
                events={events}
                eventClick={(info) => {
                    const tarefaClicada = tarefas.find(
                        (tarefa) => tarefa.id === Number(info.event.id)
                    );
                    if (tarefaClicada) {
                        onSelectTarefa(tarefaClicada);
                    }
                }}
                
                eventContent={renderEventContent}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                }}

                buttonText={{
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia',
                    list: 'Lista',
                    prev: 'Anterior',
                    next: 'Próximo',
                    prevYear: 'Ano Anterior',
                    nextYear: 'Próximo Ano',
                }}
                
                dayHeaderFormat={{ weekday: 'short' }}
                dayHeaders={true}
                slotLabelFormat={{ weekday: 'short', day: 'numeric', month: 'numeric' }}
                dayHeaderContent={(args) => {
                    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                    return weekdays[args.date.getDay()];
                }}

                monthStartFormat={{ year: 'numeric', month: 'long' }}
                titleFormat={{ year: 'numeric', month: 'long' }}
                allDayText="Dia inteiro"
                noEventsContent='Não há eventos nesse período'
                height={500}
                />
            <style>
                {`
                    @media (max-width: 768px) {
                        .fc-header-toolbar {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px
                        }
                        .fc-header-toolbar .fc-toolbar-chunk:first-child {
                        order: 1;
                        }
                        .fc-header-toolbar .fc-toolbar-chunk:nth-child(2) {
                        order: 0;
                        }
                        .fc-header-toolbar .fc-toolbar-chunk:last-child {
                        order: 2;
                        }
                    }
                `}
            </style>
        </div>
    )
}