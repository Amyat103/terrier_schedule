import React, { useMemo } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import SectionItem from './SectionItem';
import PropTypes from 'prop-types';

function SectionList({ courseId }) {
  const { sections } = useSchedule();
  const courseSections = sections[courseId] || [];

  const groupedSections = useMemo(() => {
    return courseSections.reduce((acc, section) => {
      const key = `${section.class_section}-${section.professor_name}`;
      if (!acc[key]) {
        acc[key] = {
          ...section,
          timeSlots: [
            {
              id: section.id,
              days: section.days,
              start_time: section.start_time,
              end_time: section.end_time,
              location: section.location,
            },
          ],
        };
      } else {
        acc[key].timeSlots.push({
          id: section.id,
          days: section.days,
          start_time: section.start_time,
          end_time: section.end_time,
          location: section.location,
        });
      }
      return acc;
    }, {});
  }, [courseSections]);

  if (courseSections.length === 0) {
    return <p>No sections available for this course.</p>;
  }

  return (
    <div className='section-list mt-2 grid grid-cols-2 gap-4'>
      {Object.values(groupedSections).map((section) => (
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
