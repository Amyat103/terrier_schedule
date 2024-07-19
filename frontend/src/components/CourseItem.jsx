import { useState } from 'react';
import SectionList from './SectionList';

function CourseItem({ course }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className='course-item p-4 border rounded mb-2'>
      <h3 className='font-medium'>
        {course.major} {course.course_number}: {course.short_title}
      </h3>
      <p>Title: {course.full_title}</p>
      <p>Description: {course.description}</p>
    </div>
  );
}

export default CourseItem;
