import React from 'react';
import { MemoizedSectionList } from './SectionList';
import { useSchedule } from '../context/ScheduleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

function CourseItem({ course, isExpanded, onExpand }) {
  const { sections } = useSchedule();
  const courseSections = sections[course.course_id] || [];

  return (
    <div className='course-item border rounded mb-2'>
      <div
        className='p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-300'
        onClick={() => onExpand(course.course_id)}
      >
        <div className='course-header flex justify-between items-center'>
          <div className='flex items-center'>
            <h3 className='font-bold text-lg mr-2'>
              {course.major} {course.course_number}: {course.short_title}
            </h3>
            <FontAwesomeIcon
              icon={isExpanded ? faChevronUp : faChevronDown}
              className='text-red-600 text-lg'
            />
          </div>
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              course.is_registerable
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {course.is_registerable ? 'Registrable' : 'Not Registrable'}
          </span>
        </div>
        {isExpanded && (
          <div className='mt-2'>
            <p className='text-gray-700 mb-2'>{course.description}</p>
            <MemoizedSectionList courseId={course.course_id} />
          </div>
        )}
      </div>
    </div>
  );
}

export const MemoizedCourseItem = React.memo(CourseItem);
