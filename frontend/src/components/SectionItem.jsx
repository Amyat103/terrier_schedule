import React from 'react';
import { useSchedule } from '../context/ScheduleContext';

function SectionItem({ section }) {
  const { addCourse, removeCourse, selectedCourses } = useSchedule();
  const isSelected = selectedCourses.some((s) => s.id === section.id);

  const handleToggle = () => {
    if (isSelected) {
      removeCourse(section.id);
    } else {
      console.log('Adding course (full object):', section);
      addCourse(section);
    }
  };

  return (
    <div className='section-item p-2 border rounded flex flex-col h-full hover:bg-gray-100 transition-colors duration-200'>
      {' '}
      <div className='flex-grow'>
        {' '}
        <p>
          <span className='font-semibold'>Section:</span>{' '}
          {section.class_section}
        </p>
        <p>
          <span className='font-semibold'>Type:</span> {section.class_type}
        </p>
        <p>
          <span className='font-semibold'>Professor:</span>{' '}
          {section.professor_name}
        </p>
        <p>
          <span className='font-semibold'>Time:</span> {section.days}{' '}
          {section.start_time} - {section.end_time}
        </p>
        <p>
          <span className='font-semibold'>Location:</span> {section.location}
        </p>
        <p>
          <span className='font-semibold'>Availability:</span>{' '}
          {section.enrollment_available}/{section.class_capacity}
        </p>
      </div>
      <button
        onClick={handleToggle}
        className='mt-2 w-full px-2 py-1 bg-red-700 text-white rounded hover:bg-red-800 transition-colors'
      >
        {isSelected ? 'Remove' : 'Add'}
      </button>
    </div>
  );
}

export default SectionItem;
