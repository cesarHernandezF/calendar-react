type CalendarEventProps = {
    event: {
        title: string;
        user: {
            name: string;
        };
    };
};

export const CalendarEvent = ({ event }: CalendarEventProps) => {
    const { title, user } = event;

    return (
        <>
            <strong>{title}</strong>
            <strong> - {user.name}</strong>
        </>
    );
};
