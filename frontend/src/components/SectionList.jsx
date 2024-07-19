import React from 'react';
import SectionItem from './SectionItem';

function SectionList({ sections }) {
  return (
    <div className='section-list mt-2'>
      <h4 className='font-medium mb-2'>Sections:</h4>
      {sections.map((section) => (
        <SectionItem key={section.id} section={section} />
      ))}
    </div>
  );
}

export default SectionList;