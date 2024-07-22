import React from 'react';
import { MemoizedSectionList } from './SectionList';
import { useSchedule } from '../context/ScheduleContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

function CourseItem({ course, isExpanded, onExpand }) {
  const { sections } = useSchedule();
  const courseSections = sections[course.course_id] || [];

  return (
    <div className='course-item border rounded mb-2 relative'>
      <div
        className='p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-300'
        onClick={() => onExpand(course.course_id)}
      >
        <div className='course-header flex justify-between items-center pr-8'>
          <h3 className='font-bold text-lg'>
            {course.major} {course.course_number}: {course.short_title}
          </h3>
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
        <div className='absolute top-4 right-4'>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`text-red-600 text-lg transition-transform duration-300 ease-in-out ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px]' : 'max-h-0'
        }`}
      >
        <div className='px-4 pb-4'>
          <p className='text-gray-700 mb-4'>{course.description}</p>
          <MemoizedSectionList courseId={course.course_id} />
        </div>
      </div>
    </div>
  );
}

export const MemoizedCourseItem = React.memo(CourseItem);
