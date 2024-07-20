import React from 'react';
import { MemoizedSectionList } from './SectionList';

function CourseItem({ course, isExpanded, onExpand }) {
  return (
    <div
      className='course-item p-4 border rounded mb-2 cursor-pointer hover:bg-gray-100 transition-colors duration-300'
      onClick={() => onExpand(course.course_id)}
    >
      <div className='course-header flex justify-between items-center'>
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
      {isExpanded && (
        <div className='course-details mt-2'>
          <p className='font-bold mb-2'>Title: {course.full_title}</p>
          <p className='mb-2 bg-gray-100 p-2 rounded'>{course.description}</p>
          <MemoizedSectionList courseId={course.course_id} />
        </div>
      )}
    </div>
  );
}

export const MemoizedCourseItem = React.memo(CourseItem);
