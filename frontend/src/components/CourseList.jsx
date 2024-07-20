import React, { useState, useMemo } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { MemoizedCourseItem } from './CourseItem';

function CourseList() {
  const { courses, loading, error } = useSchedule();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [generalSearch, setGeneralSearch] = useState('');

  const majors = useMemo(() => {
    return [...new Set(courses.map((course) => course.major))].sort();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesMajor = selectedMajor
        ? course.major === selectedMajor
        : true;
      const matchesCourseNumber = courseNumber
        ? course.course_number.includes(courseNumber)
        : true;
      const matchesGeneral = generalSearch
        ? `${course.major} ${course.course_number} ${course.short_title} ${course.full_title} ${course.description}`
            .toLowerCase()
            .includes(generalSearch.toLowerCase())
        : true;
      return matchesMajor && matchesCourseNumber && matchesGeneral;
    });
  }, [courses, selectedMajor, courseNumber, generalSearch]);

  const handleExpand = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='course-list h-full flex flex-col'>
      <h2 className='text-xl font-semibold mb-4'>Course List</h2>
      <div className='mb-4 flex space-x-4'>
        <select
          value={selectedMajor}
          onChange={(e) => setSelectedMajor(e.target.value)}
          className='p-2 border rounded'
        >
          <option value=''>All Majors</option>
          {majors.map((major) => (
            <option key={major} value={major}>
              {major}
            </option>
          ))}
        </select>
        <input
          type='text'
          placeholder='Course Number'
          className='p-2 border rounded'
          value={courseNumber}
          onChange={(e) => setCourseNumber(e.target.value)}
        />
        <input
          type='text'
          placeholder='Search all fields'
          className='flex-grow p-2 border rounded'
          value={generalSearch}
          onChange={(e) => setGeneralSearch(e.target.value)}
        />
      </div>
      <div className='overflow-auto flex-grow'>
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
