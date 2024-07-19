import React, { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import CourseItem from './CourseItem';

function CourseList() {
  const { courses, loading, error } = useSchedule();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredCourses = courses.filter(
    (course) =>
      course.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.short_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExpand = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

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
      <div className='space-y-2'>
        {filteredCourses.map((course) => (
          <CourseItem
            key={course.id}
            course={course}
            isExpanded={expandedCourseId === course.id}
            onExpand={() => {
              handleExpand(course.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default CourseList;
