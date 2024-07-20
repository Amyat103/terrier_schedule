import React from 'react';
import { useSchedule } from '../context/ScheduleContext';
import SectionItem from './SectionItem';

function SectionList({ courseId }) {
  const { sections } = useSchedule();

  console.log('CourseId in SectionList:', courseId);
  console.log('All sections:', sections);

  const courseSections = sections[courseId] || [];

  console.log('Sections for this course:', courseSections);

  if (courseSections.length === 0) {
    return <p>No sections available for this course.</p>;
  }

  return (
    <div className='section-list mt-2'>
      <h4 className='font-medium mb-2'>Sections ({courseSections.length}):</h4>
      {courseSections.map((section) => (
        <SectionItem key={section.id} section={section} />
      ))}
    </div>
  );
}

export const MemoizedSectionList = React.memo(SectionList);
export default SectionList;
