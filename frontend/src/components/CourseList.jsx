import React, { useState, useMemo } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { MemoizedCourseItem } from './CourseItem';

function CourseList() {
  const { courses, loading, error } = useSchedule();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) =>
      `${course.major} ${course.course_number} ${course.short_title}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const handleExpand = (courseId) => {
    console.log('Expanding course with ID:', courseId);
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='course-list'>
      <h2 className='text-xl font-semibold mb-4'>Course List</h2>
      <input
        type='text'
        placeholder='Search courses...'
        className='w-full p-2 mb-4 border rounded'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className='space-y-1'>
        {filteredCourses.map((course) => (
          <MemoizedCourseItem
            key={course.course_id}
            course={course}
            isExpanded={expandedCourseId === course.course_id}
            onExpand={handleExpand}
          />
        ))}
      </div>
    </div>
  );
}

export default CourseList;
