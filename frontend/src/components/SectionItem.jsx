import React from 'react';
import { useSchedule } from '../context/ScheduleContext';

function SectionItem({ section }) {
  const { toggleCourseSelection, selectedCourses } = useSchedule();
  const isSelected = selectedCourses.some((s) => s.id === section.id);

  return (
    <div className='section-item p-2 border rounded'>
      <div>
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
        onClick={() => toggleCourseSelection(section)}
        className='mt-2 px-2 py-1 bg-blue-500 text-white rounded'
      >
        {isSelected ? 'Remove' : 'Add'}
      </button>
    </div>
  );
}

export default SectionItem;
