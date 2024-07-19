import React, { useState } from 'react';
import SectionList from './SectionList';

function CourseItem({ course, isExpanded, onExpand }) {
  const registrableStyle = course.is_registerable
    ? 'bg-green-500 text-white'
    : 'bg-red-500 text-white';

  return (
    <div className='course-item p-4 border rounded mb-2'>
      <div
        className='course-header cursor-pointer flex justify-between items-center'
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className='font-medium'>
          {course.major} {course.course_number}: {course.short_title}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-sm ${registrableStyle}`}
        />
      </div>
      {isExpanded && (
        <div className='course-details mt-2'>
          <p className='mb-2'>Title: {course.full_title}</p>
          <p className='mb-2'>Description: {course.description}</p>
          <SectionList courseId={course.id} />
        </div>
      )}
    </div>
  );
}

export default CourseItem;
