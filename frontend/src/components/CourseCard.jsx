import React from 'react';
import { timeToMinutes } from '../utils/calendarUtils';
import PropTypes from 'prop-types';

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
      <div className='font-bold'>{course.short_title}</div>
      <div>{`${course.start_time} - ${course.end_time}`}</div>
    </div>
  );
}

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    short_title: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  groupSize: PropTypes.number.isRequired,
};

export default React.memo(CourseCard);
