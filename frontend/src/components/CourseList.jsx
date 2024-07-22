import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { MemoizedCourseItem } from './CourseItem';

const ITEMS_PER_BATCH = 20;

function CourseList() {
  const { courses, loading, error } = useSchedule();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [generalSearch, setGeneralSearch] = useState('');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_BATCH);
  const scrollContainerRef = useRef(null);

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

  const coursesToDisplay = useMemo(() => {
    return filteredCourses.slice(0, displayCount);
  }, [filteredCourses, displayCount]);

  const handleExpand = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
  };

  const checkScrollPosition = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    if (
      scrollHeight - scrollTop - clientHeight < 200 &&
      displayCount < filteredCourses.length
    ) {
      setDisplayCount((prev) =>
        Math.min(prev + ITEMS_PER_BATCH, filteredCourses.length)
      );
    }
  }, [displayCount, filteredCourses.length]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      }
    };
  }, [checkScrollPosition]);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_BATCH);
  }, [selectedMajor, courseNumber, generalSearch]);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='course-list h-full flex flex-col'>
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
      <div ref={scrollContainerRef} className='overflow-auto flex-grow'>
        {coursesToDisplay.map((course) => (
          <MemoizedCourseItem
            key={course.course_id}
            course={course}
            isExpanded={expandedCourseId === course.course_id}
            onExpand={handleExpand}
          />
        ))}
        {displayCount < filteredCourses.length && (
          <div className='text-center py-4'>Loading more courses...</div>
        )}
      </div>
    </div>
  );
}

export default CourseList;
