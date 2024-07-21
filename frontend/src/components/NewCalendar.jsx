// NewCalendar.jsx
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useSchedule } from '../context/ScheduleContext';

const localizer = momentLocalizer(moment);

function NewCalendar() {
  const { selectedCourses } = useSchedule();

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
      };
    });
  });

  return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        defaultView='week'
        views={['week']}
        min={moment().hours(7).minutes(0).toDate()}
        max={moment().hours(22).minutes(0).toDate()}
        step={30}
        timeslots={1}
      />
    </div>
  );
}

export default NewCalendar;
