import React from 'react';

function SectionItem({ section, isExpanded, onExpand }) {
  return (
    <div className='section-item p-2 border rounded mb-1'>
      <div
        className='section-header cursor-pointer flex justify-between items-center'
        onClick={() => onExpand(section.id)}
      >
        <h4 className='font-medium'>Section {section.section_number}</h4>
        <span className='text-sm'>{section.instructor}</span>
      </div>
      {isExpanded && (
        <div className='section-details mt-2'>
          <p>Time: {section.time}</p>
          <p>Location: {section.location}</p>
          <p>Capacity: {section.capacity}</p>
        </div>
      )}
    </div>
  );
}

export default SectionItem;
