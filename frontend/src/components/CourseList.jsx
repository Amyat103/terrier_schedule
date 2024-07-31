import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import { MemoizedCourseItem } from './CourseItem';
import CustomDropdown from './CustomDropdown';
import ToggleButton from './ToggleButton';
// import { faBullseye } from '@fortawesome/free-solid-svg-icons';

const ITEMS_PER_BATCH = 20;

function CourseList() {
  const { courses, loading, error } = useSchedule();
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState('');
  // const [courseNumber, setCourseNumber] = useState('');
  const [generalSearch, setGeneralSearch] = useState('');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_BATCH);
  const scrollContainerRef = useRef(null);
  const [showRegistrableOnly, setShowRegistrableOnly] = useState(false);

  const majors = useMemo(() => {
    return Array.isArray(courses)
      ? [...new Set(courses.map((course) => course.major))].sort()
      : [];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return Array.isArray(courses)
      ? courses.filter((course) => {
          const matchesMajor = selectedMajor
            ? course.major === selectedMajor
            : true;
          // const matchesCourseNumber = courseNumber
          //   ? course.course_number.includes(courseNumber)
          //   : true;
          const matchesGeneral = generalSearch
            ? `${course.major} ${course.course_number} ${course.short_title} ${course.full_title} ${course.description}`
                .toLowerCase()
                .includes(generalSearch.toLowerCase())
            : true;
          const matchesRegistrable = showRegistrableOnly
            ? course.is_registerable
            : true;
          return (
            matchesMajor &&
            // matchesCourseNumber &&
            matchesGeneral &&
            matchesRegistrable
          );
        })
      : [];
  }, [
    courses,
    selectedMajor,
    // courseNumber,
    generalSearch,
    showRegistrableOnly,
  ]);

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
  }, [selectedMajor, generalSearch]);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!Array.isArray(courses))
    return (
      <div>Invalid course data received. Please try refreshing the page.</div>
    );
  if (courses.length === 0) return <div>No courses available.</div>;

  return (
    <div className='course-list h-full flex flex-col'>
      <div className='text-sm mb-4 flex space-x-4 items-center'>
        <CustomDropdown
          options={majors}
          value={selectedMajor}
          onChange={(major) => setSelectedMajor(major)}
        />
        {/* <input
          type='text'
          placeholder='Course # (e.g. 114)'
          className='p-2 border rounded'
          value={courseNumber}
          onChange={(e) => setCourseNumber(e.target.value)}
        /> */}
        <input
          type='text'
          placeholder='Search for majors and # (cs112, casph 155)'
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
