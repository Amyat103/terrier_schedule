import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './NewCalendar.css';
import { useSchedule } from '../context/ScheduleContext';

const localizer = momentLocalizer(moment);

const TimeGutterHeader = () => null;

const WeekHeader = ({ date }) => {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const dayIndex = date.getDay() - 1;
  return dayIndex >= 0 && dayIndex < 5 ? (
    <span>{weekdays[dayIndex]}</span>
  ) : null;
};

const EventComponent = ({ event }) => (
  <div>
    <div>{event.short_title}</div>
    <div>
      {event.start_time} - {event.end_time}
    </div>
  </div>
);

function NewCalendar() {
  const { selectedCourses, courseColors } = useSchedule();

  const events = selectedCourses.flatMap((course) => {
    const days = course.days.match(/.{2}/g) || [];
    return days.map((day) => {
      const date = moment().day(
        day === 'Th'
          ? 4
          : day === 'Tu'
          ? 2
          : ['Mo', 'Tu', 'We', 'Th', 'Fr'].indexOf(day) + 1
      );
      const start = moment(
        `${date.format('YYYY-MM-DD')} ${course.start_time}`,
        'YYYY-MM-DD h:mm a'
      ).toDate();
      const end = moment(
        `${date.format('YYYY-MM-DD')} ${course.end_time}`,
        'YYYY-MM-DD h:mm a'
      ).toDate();
      return {
        title: `${course.major}${course.course_number}: ${course.short_title}`,
        start,
        end,
        courseId: course.course_id,
      };
    });
  });

  return (
    <div className='calendar-container'>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        defaultView='week'
        views={['week']}
        min={moment().hours(8).minutes(0).toDate()}
        max={moment().hours(21).minutes(0).toDate()}
        step={60}
        timeslots={1}
        formats={{
          timeGutterFormat: (date, culture, localizer) =>
            localizer.format(date, 'h A', culture),
        }}
        components={{
          timeGutterHeader: TimeGutterHeader,
          week: {
            header: WeekHeader,
          },
          event: EventComponent,
        }}
        toolbar={false}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: courseColors[event.courseId],
          },
        })}
      />
    </div>
  );
}

export default NewCalendar;
