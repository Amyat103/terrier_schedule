import React, { useMemo } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import {
  dayOrder,
  groupCoursesByDay,
  sortAndGroupOverlappingCourses,
} from '../utils/calendarUtils';
import GridBackground from './GridBackground';
import CourseCard from './CourseCard';

function HoursColumn() {
  const hours = Array.from({ length: 15 }, (_, i) => i + 7);

  return (
    <div className='w-16 grid grid-rows-[auto,repeat(15,1fr)] h-full'>
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
    <div className='calendar-container'>
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

export default Calendar;
