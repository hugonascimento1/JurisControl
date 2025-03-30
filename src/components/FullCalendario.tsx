import React from "react"
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list';
import { EventContentArg } from "@fullcalendar/core/index.js";

interface Evento {
    title: string;
    start: string;
    end: string;
    description: string;
}



export function FullCalendario() {
    const events: Evento[] = [
        {
            title: 'Reunião',
            start: '2024-06-10T10:00:00',
            end: '2024-06-10T12:00:00',
            description: 'Reunião de planejamento do projeto.',
        },
        {
            title: 'Almoço',
            start: '2024-06-15T12:00:00',
            end: '2024-06-15T13:00:00',
            description: 'Almoço com a equipe.',
        },
    ]

    function renderEventContent(eventInfo: EventContentArg) {
        return (
            <div style={{ backgroundColor: 'lightblue' }}>
                <b>{eventInfo.event.title}</b>
                <p>{eventInfo.event.extendedProps.description}</p>
                <p>Início: {eventInfo.event.start ? formatDate(eventInfo.event.start.toISOString()) : 'N/A'}</p>
                <p>Fim: {eventInfo.event.end ? formatDate(eventInfo.event.end.toISOString()) : 'N/A'}</p>
            </div>
        )
    }

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return date.toLocaleDateString('pt-BR', options);
    }


    return (
        <div style={{ height: '100%' }}>
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                events={events}
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
                locale={'pt'}
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

            />
            <style>
                {`
                fc {
            max-height: 450px; /* Ajuste a altura máxima conforme necessário */
            overflow: auto;
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