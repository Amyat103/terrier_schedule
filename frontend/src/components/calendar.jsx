import React, { useMemo, useEffect, useState } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import '../styles.css';

function Calendar() {
  const { selectedCourses } = useSchedule();
  const [, forceUpdate] = useState();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = [...Array(13).keys()].map((i) => i + 8);

  useEffect(() => {
    console.log('Selected Courses in useEffect:', selectedCourses);
    forceUpdate({});
  }, [selectedCourses]);

  const timeToHour = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period.toLowerCase() === 'pm' && hours !== 12) {
      hours += 12;
    }
    return hours + minutes / 60;
  };

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour} ${ampm}`;
  };

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsla(${hue}, 70%, 50%, 0.7)`;
  };

  const courseData = useMemo(() => {
    console.log('Calculating courseData, selectedCourses:', selectedCourses);
    return selectedCourses.map((course) => ({
      ...course,
      color: getRandomColor(),
      startHour: timeToHour(course.start_time),
      endHour: timeToHour(course.end_time),
      days: course.days.match(/.{2}/g) || [],
    }));
  }, [selectedCourses]);

  console.log('Rendered courseData:', courseData);

  const getCoursesForSlot = (day, hour) => {
    const dayMap = { Mon: 'Mo', Tue: 'Tu', Wed: 'We', Thu: 'Th', Fri: 'Fr' };
    return courseData.filter((course) => {
      const isCorrectDay = course.days.includes(dayMap[day]);
      const isWithinTimeSlot =
        hour >= course.startHour && hour < course.endHour;
      return isCorrectDay && isWithinTimeSlot;
    });
  };

  const totalCourses = courseData.length;
  return (
    <div className='weekly-calendar' style={{ height: '70vh' }}>
      <div
        className='grid grid-cols-[auto,1fr,1fr,1fr,1fr,1fr] h-full'
        style={{ gap: 0 }}
      >
        <div>Total Courses: {totalCourses}</div>
        <div
          className='col-start-2 col-span-5 grid grid-cols-5'
          style={{ gap: 0 }}
        >
          {days.map((day) => (
            <div key={day} className='text-center font-bold border-b'>
              {day}
            </div>
          ))}
        </div>
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className='flex items-center justify-end pr-2 h-8 border-r'>
              {formatHour(hour)}
            </div>
            {days.map((day) => (
              <div key={`${day}-${hour}`} className='border relative h-8'>
                {getCoursesForSlot(day, hour).map((course, index, array) => {
                  console.log(
                    `Rendering course for ${day} at ${hour}:`,
                    course
                  );
                  return (
                    <div
                      key={course.id}
                      className='border border-solid absolute overflow-hidden'
                      style={{
                        backgroundColor: course.color,
                        top: `${Math.max((course.startHour - hour) * 100, 0)}%`,
                        height: `${Math.min(
                          (course.endHour - Math.max(course.startHour, hour)) *
                            100,
                          100
                        )}%`,
                        width: `${100 / array.length}%`,
                        left: `${(index * 100) / array.length}%`,
                      }}
                    >
                      <span className='text-xs whitespace-nowrap'>{`${course.major}${course.course_number}`}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
