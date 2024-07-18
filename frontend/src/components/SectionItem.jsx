import React from 'react';

function SectionItem({ section }) {
  return (
    <div className='section-item p-2 border-t'>
      <p>
        {section.type} - {section.time}
      </p>
    </div>
  );
}

export default SectionItem;
