import React from 'react';
import { timeToMinutes } from '../utils/calendarUtils';

function CourseCard({ course, index, groupSize }) {
  const startMinutes = timeToMinutes(course.start_time);
  const endMinutes = timeToMinutes(course.end_time);
  const duration = endMinutes - startMinutes;

  const calendarStart = 7 * 60;
  const calendarDuration = 15 * 60;

  const top = ((startMinutes - calendarStart) / calendarDuration) * 100;
  const height = (duration / calendarDuration) * 100;
  const width = 100 / groupSize;
  const left = width * index;

  console.log('Calculated top:', top);
  console.log('Calculated height:', height);

  console.log('Course:', course);
  console.log('Start time:', course.start_time);
  console.log('End time:', course.end_time);
  console.log('Start minutes:', startMinutes);
  console.log('End minutes:', endMinutes);
  console.log('Duration:', duration);
  console.log('Calendar start:', calendarStart);
  console.log('Calendar duration:', calendarDuration);

  return (
    <div
      className='absolute rounded shadow-sm p-1 text-xs overflow-hidden'
      style={{
        top: `${top}%`,
        height: `${height}%`,
        width: `${width}%`,
        left: `${left}%`,
        backgroundColor: `hsl(${Math.random() * 360}, 70%, 80%)`,
      }}
    >
      <div className='font-bold'>{`${course.major}${course.course_number}`}</div>
      <div>{`${course.start_time} - ${course.end_time}`}</div>
    </div>
  );
}

export default React.memo(CourseCard);
