import React from 'react';
import { useSchedule } from '../context/ScheduleContext';

function SectionItem({ section }) {
  const { toggleCourseSelection, selectedCourses } = useSchedule();
  const isSelected = selectedCourses.some((s) => s.id === section.id);

  return (
    <div className='section-item p-2 border-b flex justify-between items-center'>
      <div>
        <p>Section: {section.class_section}</p>
        <p>Type: {section.class_type}</p>
        <p>Professor: {section.professor_name}</p>
        <p>
          Time: {section.days} {section.start_time} - {section.end_time}
        </p>
        <p>Location: {section.location}</p>
        <p>
          Availability: {section.enrollment_available}/{section.class_capacity}
        </p>
      </div>
      <button
        onClick={() => toggleCourseSelection(section)}
        className='px-2 py-1 bg-blue-500 text-white rounded'
      >
        {isSelected ? '-' : '+'}
      </button>
    </div>
  );
}

export default SectionItem;
