import React from 'react';
import { MemoizedSectionList } from './SectionList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

function CourseItem({ course, isExpanded, onExpand }) {
  return (
    <div className='course-item border rounded mb-2 relative'>
      <div
        className='p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-300'
        onClick={() => onExpand(course.course_id)}
      >
        <div className='course-header flex justify-between items-center'>
          <h3 className='font-bold text-lg'>
            {course.major} {course.course_number}: {course.short_title}
          </h3>
          <div className='flex items-center space-x-2'>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                course.is_registerable
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {course.is_registerable ? 'Registrable' : 'Not Registrable'}
            </span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-red-600 text-lg transition-transform duration-300 ease-in-out ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px]' : 'max-h-0'
        }`}
      >
        <div className='px-4 pb-4'>
          <h4 className='font-bold text-sm mt-2 mb-1'>Description</h4>
          <p className='text-gray-700 mb-4 text-sm'>{course.description}</p>
          <MemoizedSectionList courseId={course.course_id} />
        </div>
      </div>
    </div>
  );
}

CourseItem.propTypes = {
  course: PropTypes.shape({
    course_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    major: PropTypes.string.isRequired,
    course_number: PropTypes.string.isRequired,
    short_title: PropTypes.string.isRequired,
    is_registerable: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func.isRequired,
};

export const MemoizedCourseItem = React.memo(CourseItem);
