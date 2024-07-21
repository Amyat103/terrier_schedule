import React, { useMemo } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import {
  dayOrder,
  groupCoursesByDay,
  sortAndGroupOverlappingCourses,
} from '../utils/calendarUtils';
import GridBackground from './GridBackground';
import CourseCard from './CourseCard';

function Calendar() {
  const { selectedCourses } = useSchedule();

  const coursesByDay = useMemo(() => {
    return groupCoursesByDay(selectedCourses);
  }, [selectedCourses]);

  const groupedCoursesByDay = useMemo(() => {
    const grouped = {};
    Object.entries(coursesByDay).forEach(([day, courses]) => {
      grouped[day] = sortAndGroupOverlappingCourses(courses);
    });
    return grouped;
  }, [coursesByDay]);

  return (
    <div className='h-[840px] flex'>
      <div className='w-16 flex flex-col'>
        <div className='h-10'></div>
        {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
          <div
            key={hour}
            className='flex-1 flex items-end justify-end pr-2 text-xs text-gray-500'
          >
            {hour % 12 || 12} {hour < 12 ? 'AM' : 'PM'}
          </div>
        ))}
      </div>
      <div className='flex-grow grid grid-cols-5 relative'>
        <GridBackground />
        <div className='absolute inset-0 grid grid-cols-5'>
          {dayOrder.map((day) => (
            <div key={day} className='relative'>
              {groupedCoursesByDay[day]?.map((group, groupIndex) => (
                <div key={groupIndex} className='absolute inset-0'>
                  {group.map((course, courseIndex) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={courseIndex}
                      groupSize={group.length}
                    />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
