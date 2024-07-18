import { useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import CourseItem from './CourseItem';

function CourseList() {
  const { courses, loading, error } = useSchedule();
  const [searchTerm, setSearchTerm] = useState('');

  console.log(
    'CourseList render - courses:',
    courses,
    'loading:',
    loading,
    'error:',
    error
  );

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!Array.isArray(courses)) return <div>No courses available</div>;

  const filteredCourses = courses.filter(
    (course) =>
      course.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.short_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (courses.length === 0) return <div>No courses available</div>;

  if (loading) return <div className='text-center'>Loading courses...</div>;
  if (error) return <div className='text-center text-red-500'>{error}</div>;

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
          <CourseItem key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

export default CourseList;
