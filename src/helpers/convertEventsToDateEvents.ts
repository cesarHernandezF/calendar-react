import { parseISO } from "date-fns";

type CalendarEvent = {
    start: string;
    end: string;
    [key: string]: any;
};

export const convertEventsToDateEvents = (events: CalendarEvent[] = []) => {
    return events.map((event) => ({
        ...event,
        start: parseISO(event.start),
        end: parseISO(event.end),
    }));
};
