import React from 'react';

function SectionItem({ section, isExpanded, onExpand }) {
  return (
    <div className='section-item p-2 border-t'>
      <p>
        Section: {section.class_section} - {section.class_type}
        <br />
        Time: {section.start_time} - {section.end_time} {section.days}
        <br />
        Location: {section.location}
        <br />
        Enrollment Available: {section.enrollment_available}
        <br />
        Class Capacity: {section.class_capacity}
        <br />
        Enrollment Total: {section.enrollment_total}
      </p>
    </div>
  );
}

export default SectionItem;
