import React, { useState } from 'react';
import SectionItem from './SectionItem';
import { useSchedule } from '../context/ScheduleContext';

function SectionList({ courseId }) {
  const { sections } = useSchedule();
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  const courseSections = sections.filter(
    (section) => section.courseId === courseId
  );

  const handleExpand = (sectionId) => {
    setExpandedSectionId(expandedSectionId === sectionId ? null : sectionId);
  };

  return (
    <div className='section-list mt-2'>
      <h4 className='font-medium mb-2'>Sections:</h4>
      {courseSections.map((section) => {
        <SectionItem
          key={section.id}
          section={section}
          isExpanded={expandedSectionId === section.id}
          onExpand={() => handleExpand(section.id)}
        />;
      })}
    </div>
  );
}

export default SectionList;
