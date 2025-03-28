import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment, { locales } from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { ptBR } from 'date-fns/locale'; // Importe a localização

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
  description: string;
}

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      title: 'Reunião',
      start: new Date(2025, 3, 26, 10, 0),
      end: new Date(2025, 3, 27, 12, 0),
      description: 'Reuião com meu cliente sobre o processo dele',
    },
    {
      title: 'Almoço',
      start: new Date(2025, 3, 29, 12, 0),
      end: new Date(2025, 3, 31, 13, 0),
      description: 'Reuião com meu cliente sobre o processo dele',
    },
  ]);

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        culture="pt-BR"
      />
    </div>
  );
};

export default MyCalendar;