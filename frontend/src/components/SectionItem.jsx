import React from 'react';

function SectionItem({ section, isExpanded, onExpand }) {
  return (
    <div className='section-item p-2 border-t'>
      <div
        className='flex justify-between items-center cursor-pointer'
        onClick={onExpand}
      >
        <span>
          {section.class_type}: {section.class_section}
        </span>
      </div>
      {isExpanded && (
        <div className='section-details mt-2'>
          <p>Professor: {section.professor_name}</p>
          <p>
            Time: {section.days} {section.start_time} - {section.end_time}
          </p>
          <p>Location: {section.location}</p>
          <p>Capacity: {section.class_capacity}</p>
          <p>Enrolled: {section.enrollment_total}</p>
          <p>Available: {section.enrollment_available}</p>
        </div>
      )}
    </div>
  );
}

export default SectionItem;
