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

  console.log('Calendar rendering, selectedCourses:', selectedCourses);

  const coursesByDay = useMemo(() => {
    console.log('Grouping courses by day:', selectedCourses);
    return groupCoursesByDay(selectedCourses);
  }, [selectedCourses]);

  const groupedCoursesByDay = useMemo(() => {
    console.log('Sorted and grouped courses:', coursesByDay);
    const grouped = {};
    Object.entries(coursesByDay).forEach(([day, courses]) => {
      grouped[day] = sortAndGroupOverlappingCourses(courses);
    });
    return grouped;
  }, [coursesByDay]);

  console.log('Final grouped courses for rendering:', groupedCoursesByDay);

  return (
    <div className='flex h-full'>
      <HoursColumn />
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

function HoursColumn() {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8);

  return (
    <div className='w-16 grid grid-rows-[auto,repeat(14,1fr)] h-full'>
      <div className='h-10'></div>
      {hours.map((hour) => (
        <div
          key={hour}
          className='flex items-end justify-end pr-2 text-sm text-gray-500'
        >
          {hour % 12 || 12} {hour < 12 ? 'AM' : 'PM'}
        </div>
      ))}
    </div>
  );
}

export default Calendar;
