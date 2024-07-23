import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { MemoizedCourseItem } from './CourseItem';
import CustomDropdown from './CustomDropdown';
import ToggleButton from './ToggleButton';

const ITEMS_PER_BATCH = 20;

function CourseList() {
  const { courses, loading, error } = useSchedule();
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [generalSearch, setGeneralSearch] = useState('');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_BATCH);
  const scrollContainerRef = useRef(null);
  const [showRegistrableOnly, setShowRegistrableOnly] = useState(() => {
    const saved = localStorage.getItem('showRegistrableOnly');
    return saved !== null ? JSON.parse(saved) : true;
  });

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
    localStorage.setItem(
      'showRegistrableOnly',
      JSON.stringify(showRegistrableOnly)
    );
  }, [showRegistrableOnly]);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_BATCH);
  }, [selectedMajor, courseNumber, generalSearch]);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='course-list h-full flex flex-col'>
      <div className='mb-4 flex space-x-4 items-center'>
        <CustomDropdown
          options={majors}
          value={selectedMajor}
          onChange={(major) => setSelectedMajor(major)}
        />
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
        <ToggleButton
          label='Show Registrable Only'
          checked={showRegistrableOnly}
          onChange={setShowRegistrableOnly}
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
