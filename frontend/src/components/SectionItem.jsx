import React from 'react';

function SectionItem({ section }) {
  return (
    <div className='section-item p-2 border-b'>
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
  );
}

export default SectionItem;
