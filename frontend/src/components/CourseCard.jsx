import React from 'react';
import { timeToMinutes } from '../utils/calendarUtils';

function CourseCard({ course, index, groupSize }) {
  const startMinutes = timeToMinutes(course.start_time);
  const endMinutes = timeToMinutes(course.end_time);
  const duration = endMinutes - startMinutes;

  const top = ((startMinutes - 480) / (14 * 60)) * 100;
  const height = (duration / (14 * 60)) * 100;
  const width = 100 / groupSize;
  const left = width * index;

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  return (
    <div
      className='absolute rounded shadow-sm p-1 text-xs overflow-hidden'
      style={{
        top: `${top}%`,
        height: `${height}%`,
        width: `${width}%`,
        left: `${left}%`,
        backgroundColor: getRandomColor(),
      }}
    >
      <div className='font-bold'>{`${course.major}${course.course_number}`}</div>
      <div>{`${course.start_time} - ${course.end_time}`}</div>
    </div>
  );
}

export default React.memo(CourseCard);
