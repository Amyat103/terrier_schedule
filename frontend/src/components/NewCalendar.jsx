import { useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './NewCalendar.css';
import { useSchedule } from '../context/ScheduleContext';

const localizer = momentLocalizer(moment);

const EventComponent = ({ event }) => (
  <div style={{ lineHeight: '1.2', padding: '2px', color: 'black' }}>
    <div style={{ fontWeight: 'bold' }}>{event.title}</div>
    <div>
      {event.start_time} - {event.end_time}
    </div>
  </div>
);

const CustomEvent = ({ event }) => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    <EventComponent event={event} />
    <div style={{ fontSize: '0.7em', marginTop: 'auto' }}>
      {event.start_time} - {event.end_time}
    </div>
  </div>
);

function NewCalendar() {
  const { selectedCourses, sectionColors } = useSchedule();

  const events = selectedCourses.flatMap((section) => {
    const days = section.days.match(/.{2}/g) || [];
    return days.map((day) => {
      const date = moment().day(
        day === 'Th'
          ? 4
          : day === 'Tu'
          ? 2
          : ['Mo', 'Tu', 'We', 'Th', 'Fr'].indexOf(day) + 1
      );
      const start = moment(
        `${date.format('YYYY-MM-DD')} ${section.start_time}`,
        'YYYY-MM-DD h:mm a'
      ).toDate();
      const end = moment(
        `${date.format('YYYY-MM-DD')} ${section.end_time}`,
        'YYYY-MM-DD h:mm a'
      ).toDate();
      return {
        id: section.id,
        title: `${section.short_title}`,
        start,
        end,
        start_time: section.start_time,
        end_time: section.end_time,
      };
    });
  });

  const totalHours = 13;
  const step = useMemo(() => {
    const availableHeight = window.innerHeight * 0.7;
    const desiredSlots = totalHours * 2;
    return Math.max(30, Math.floor((totalHours * 60) / desiredSlots));
  }, []);

  return (
    <div className='calendar-container'>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        defaultView='work_week'
        views={{ work_week: true }}
        min={moment().hours(8).minutes(0).toDate()}
        max={moment().hours(21).minutes(0).toDate()}
        step={30}
        timeslots={2}
        formats={{
          timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, 'h A', culture),
          dayFormat: (date, culture, localizer) =>
            localizer.format(date, 'ddd', culture),
        }}
        components={{
          event: EventComponent,
        }}
        toolbar={false}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: sectionColors[event.id],
            border: 'none',
            boxShadow: 'none',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2px',
            height: '100%',
          },
        })}
      />
    </div>
  );
}

export default NewCalendar;
