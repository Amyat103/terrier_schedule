import React from 'react';

function SectionItem({ section }) {
  return (
    <div className='section-item p-2 border-t'>
      <p>
        Section: {section.class_section}
        {section.type} - {section.time}
        {section.days}
        {section.location}
        Enrollment Avaiable: {section.enrollment_avaiable}
        Class Capacity: {section.class_capacity}
        Enrollment total: {section.enrollment_total}
      </p>
    </div>
  );
}

export default SectionItem;
