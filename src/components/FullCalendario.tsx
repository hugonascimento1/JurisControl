import React, { useEffect, useRef, useState } from "react"
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';
import { EventContentArg } from "@fullcalendar/core/index.js";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { FileText } from 'lucide-react';

interface AgendaTarefa {
  id: number;
  titulo: string;
  descricao: string;
  data: Date;
  advogadoId: number;
}

// Interface para as props
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
    const [confirmarExclusao, setConfirmarExclusao] = React.useState(false);

    // Transforma as tarefas em um array de eventos do FullCalendar
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

    // Formatar a data para mostrar no modal de editar
    function formatDateInput(date: Date) {
        return date.toISOString().split('T')[0]; // Retorna apenas 'YYYY-MM-DD'
    }

    // Função que renderiza o conteúdo da TAREFA
    function renderEventContent(eventInfo: EventContentArg) {
        
        const tarefaId = Number(eventInfo.event.id); // ID da tarefa específica
        const tarefaSelecionada = tarefas.find(t => t.id === tarefaId); // Busca o conteúdo da tarefa pelo seu ID

        if (!tarefaSelecionada) return null;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        {/*Modal para editar a tarefa*/}
                        <Dialog>
                            <DialogTrigger>
                                <div
                                    className="border-[#030430] border-2 rounded-sm bg-white p-0.5"
                                    onClick={() => {
                                        setTarefa(tarefaSelecionada);
                                        onSelectTarefa(tarefaSelecionada);
                                        setEditarTitulo(tarefaSelecionada.titulo);
                                        setEditarDescricao(tarefaSelecionada.descricao);
                                        setEditarData(new Date(tarefaSelecionada.data));
                                        setModalTarefa(true);
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

                                    {/*Modal para confirmação de exclusão*/}
                                    <Dialog open={confirmarExclusao} onOpenChange={setConfirmarExclusao}>
                                        <DialogTrigger>
                                            <Button className="mt-4" >Excluir</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogTitle>Confirmar Exclusão</DialogTitle>
                                            <DialogDescription>
                                                Tem certeza que deseja excluir este processo e todos os seus anexos e movimentos?
                                            </DialogDescription>
                                            <Button variant="outline" onClick={() => setConfirmarExclusao(false)}>Cancelar</Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    onExcluirTarefa(tarefaId);
                                                    setConfirmarExclusao(false);
                                                    setModalTarefa(false); 
                                                }}
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

    const calendarRef = useRef<any>(null);
    
    // Função que aplica as classes
    const applyTaskClasses = () => {
        // Remove as classes anteriores
        document.querySelectorAll('.fc-daygrid-day.has-task').forEach(el => {
            el.classList.remove('has-task');
        });

        document.querySelectorAll('.fc-timegrid-col.has-task').forEach(el => {
            el.classList.remove('has-task');
        });

        // Reaplica com base nas tarefas atuais
        tarefas.forEach(tarefa => {
            const date = new Date(tarefa.data).toISOString().split('T')[0];

            const dayGridCell = document.querySelector(`.fc-daygrid-day[data-date="${date}"]`);
            if (dayGridCell) dayGridCell.classList.add('has-task');

            document.querySelectorAll(`.fc-timegrid-col[data-date="${date}"]`).forEach(el => {
                el.classList.add('has-task');
            });
        });
    };

    // Executa quando as tarefas mudam
    useEffect(() => {
        applyTaskClasses();
    }, [tarefas]);

    return (
        <div style={{ height: '100%' }}>
            <FullCalendar
                ref={calendarRef}
                datesSet={() => {
                    // Pequeno timeout para garantir que o DOM foi atualizado
                    setTimeout(applyTaskClasses, 50);
                }}
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
                    right: 'dayGridMonth,listWeek' //timeGridWeek,timeGridDay
                }}

                // Botões do calendário
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
                allDayText="Tarefa(s):"
                noEventsContent='Não há eventos nesse período'
                height={500}

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