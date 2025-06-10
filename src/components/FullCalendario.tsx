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
    onEditarTarefa: (e: React.FormEvent) => Promise<void>; // Função de editar
    onExcluirTarefa: (tarefaId: number) => Promise<void>; // Função de deletar
    // Adicione os setters para os estados de edição aqui
    setEditarTitulo: (titulo: string) => void;
    setEditarDescricao: (descricao: string) => void;
    setEditarData: (data: Date) => void;
    setModalTarefa: (isOpen: boolean) => void; // Para controlar a abertura do modal
}

export function FullCalendario({ tarefas, onSelectTarefa, onEditarTarefa, onExcluirTarefa, setEditarTitulo, setEditarDescricao, setEditarData, setModalTarefa }: FullCalendarioProps) {
    
    const [tarefa, setTarefa] = React.useState<AgendaTarefa | null>(null);
    //const [modalTarefa, setModalTarefa] = React.useState(false);
    const [confirmarExclusao, setConfirmarExclusao] = React.useState(false);

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

    function formatDateInput(date: Date) {
        return date.toISOString().split('T')[0]; // Retorna apenas 'YYYY-MM-DD'
    }

    // Função que renderiza o conteúdo da TAREFA
    function renderEventContent(eventInfo: EventContentArg) {
        const tarefaId = Number(eventInfo.event.id);
        const tarefaSelecionada = tarefas.find(t => t.id === tarefaId);

        if (!tarefaSelecionada) return null;

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
                                <div
                                    onClick={() => {
                                        setTarefa(tarefaSelecionada);
                                        onSelectTarefa(tarefaSelecionada); // Atualiza o estado tarefa na página Agenda
                                        setEditarTitulo(tarefaSelecionada.titulo);
                                        setEditarDescricao(tarefaSelecionada.descricao);
                                        setEditarData(new Date(tarefaSelecionada.data)); // Formata a data
                                        setModalTarefa(true); // Abre o modal
                                    }}
                                >
                                    <FileText className="text-[#030430]" />
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
                                                onChange={(e) => setEditarTitulo(e.target.value)}
                                                className="border-gray-300 border-2"
                                            />
                                            <Label className="text-base">Data:</Label>
                                            <Input
                                                type="date"
                                                defaultValue={eventInfo.event.start ? formatDateInput(new Date(eventInfo.event.start)) : ''}
                                                onChange={(e) => setEditarData(new Date(e.target.value))}
                                                className="border-gray-300 border-2"
                                            />
                                            <Label className="text-base">Descrição:</Label>
                                            <Textarea
                                                defaultValue={eventInfo.event.extendedProps.description}
                                                onChange={(e) => setEditarDescricao(e.target.value)}
                                                className="border-gray-300 border-2 w-full flex-grow"
                                            />
                                        </div>
                                    </form>
                                <DialogFooter>
                                    <Button 
                                        className="mt-4"
                                        type="submit"
                                        onClick={onEditarTarefa}
                                    >Editar</Button>
                                    <Dialog open={confirmarExclusao} onOpenChange={setConfirmarExclusao}>
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
                                                onClick={() => {onExcluirTarefa(tarefaId); setModalTarefa(false); setConfirmarExclusao(false);}}
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
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }}
                // dayHeaderContent={(args) => {
                //     const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                //     return weekdays[args.date.getDay()];
                // }}
                

                monthStartFormat={{ year: 'numeric', month: 'long' }}
                titleFormat={{ year: 'numeric', month: 'long' }}
                allDayText="Dia inteiro"
                noEventsContent='Não há eventos nesse período'
                height={500}

                eventDidMount={(info) => {
                    const dateStr = info.event.startStr.split('T')[0];
                    
                    // aplica no timeGrid (semanal e diário)
                    document.querySelectorAll(`.fc-timegrid-col[data-date="${dateStr}"]`).forEach(el => {
                        el.classList.add('has-task');
                    });

                    // aplica no dayGrid (mensal)
                    const dayGridCell = document.querySelector(`.fc-daygrid-day[data-date="${dateStr}"]`);
                    if (dayGridCell) {
                        dayGridCell.classList.add('has-task');
                    }
                }}

                />
            <style>
                {`
                /* Remove o fundo azul padrão do evento */
                .fc-daygrid-event {
                    background-color: transparent !important;
                    border: none !important;
                }

                /* Destaca a célula do dia com tarefa */
                    .fc-daygrid-day.has-task {
                    background-color: #cce4ff !important; /* azul claro */
                }
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