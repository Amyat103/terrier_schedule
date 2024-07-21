import React from 'react';
import { timeToMinutes, minutesToGridRow } from '../utils/calendarUtils';

function CourseCard({ course, index, groupSize }) {
  const startRow = minutesToGridRow(timeToMinutes(course.start_time));
  const endRow = minutesToGridRow(timeToMinutes(course.end_time));
  const width = 100 / groupSize;
  const left = width * index;

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  console.log('Rendering CourseCard:', course, startRow, endRow, width, left);

  return (
    <div
      className='absolute overflow-hidden rounded shadow-sm p-1 text-xs'
      style={{
        top: `${(startRow - 1) * (100 / 14)}%`,
        height: `${(endRow - startRow) * (100 / 14)}%`,
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
