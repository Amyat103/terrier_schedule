import React, { useState } from 'react';
import SectionItem from './SectionItem';
import { useSchedule } from '../context/ScheduleContext';

function SectionList({ courseId }) {
  const { sections } = useSchedule();
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  const courseSections = sections[courseId] || [];

  const handleExpand = (sectionId) => {
    setExpandedSectionId(expandedSectionId === sectionId ? null : sectionId);
  };

  if (courseSections.length === 0) {
    return <p>No sections available for this course.</p>;
  }

  return (
    <div className='section-list mt-2'>
      <h4 className='font-medium mb-2'>Sections:</h4>
      {courseSections.map((section) => (
        <SectionItem key={section.id} section={section} />
      ))}
    </div>
  );
}

export default SectionList;
