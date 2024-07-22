import React from 'react';
import { useSchedule } from '../context/ScheduleContext';
import SectionItem from './SectionItem';
import PropTypes from 'prop-types';

function SectionList({ courseId }) {
  const { sections } = useSchedule();

  const courseSections = sections[courseId] || [];

  if (courseSections.length === 0) {
    return <p>No sections available for this course.</p>;
  }

  return (
    <div className='section-list mt-2 grid grid-cols-2 gap-4'>
      {courseSections.map((section) => (
        <SectionItem key={section.id} section={section} />
      ))}
    </div>
  );
}

SectionList.propTypes = {
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

export const MemoizedSectionList = React.memo(SectionList);
export default SectionList;
