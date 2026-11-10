import { useEffect, useState } from 'react';

import { Calendar, type View } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Navbar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from "../"
import { localizer, getMessagesES } from '../../helpers';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';

interface CalendarEventType {
    title: string;
    start: Date;
    end: Date;
    user: {
        _id?: string;
        uid?: string;
        name: string;
    };
}

export const CalendarPage = () => {
    const { user } = useAuthStore();
    const { openDateModal } = useUiStore();
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();

    const [date, setDate] = useState(new Date());
    const [lastview, setLastView] = useState<View>(localStorage.getItem('lastView') as View || 'week');

    const eventStyleGetter = (event: CalendarEventType) => {
        const isMyEvent = (user.uid === event.user._id) || (user.uid === event.user.uid);

        const style = {
            backgroundColor: isMyEvent ? '#347cf7' : '#465660',
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white'
        };
        return { style };
    };

    const onDoubleClick = () => {
        openDateModal();
    }

    const onSelect = (event: CalendarEventType) => {
        setActiveEvent(event)
    }

    const onViewChanged = (event: View) => {
        console.log({ onViewChanged: event })
        localStorage.setItem('lastView', event)
        setLastView(event)
    }

    useEffect(() => {
        startLoadingEvents();
    }, [])

    return (
        <>
            <Navbar />

            <Calendar
                culture='es'
                localizer={localizer}
                events={events}
                defaultView={lastview}
                view={lastview}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100vh - 80px)' }}
                messages={getMessagesES}
                eventPropGetter={eventStyleGetter}
                components={{ event: CalendarEvent }}
                date={date}
                onNavigate={setDate}
                onView={onViewChanged}
                onDoubleClickEvent={onDoubleClick}
                onSelectEvent={onSelect}
            />

            <CalendarModal />

            <FabAddNew />

            <FabDelete />
        </>
    );
};
