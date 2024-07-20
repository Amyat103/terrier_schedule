import React, { useMemo } from 'react';
import { useSchedule } from '../context/ScheduleContext';
import '../styles.css';

//test

function Calendar() {
  const { selectedCourses } = useSchedule();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = [...Array(8).keys()].map((i) => i * 2 + 8);

  const timeToHour = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
  };

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour} ${ampm}`;
  };

  const getRandomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  };

  const courseData = useMemo(() => {
    return selectedCourses.map((course) => ({
      ...course,
      color: getRandomColor(),
      startHour: timeToHour(course.start_time),
      endHour: timeToHour(course.end_time),
      days: course.days.split(''),
    }));
  }, [selectedCourses]);

  const getCoursesForSlot = (day, hour) => {
    return courseData.filter(
      (course) =>
        course.days.includes(day[0]) &&
        hour >= course.startHour &&
        hour < course.endHour
    );
  };

  return (
    <div className='weekly-calendar' style={{ height: '50vh' }}>
      <div
        className='grid grid-cols-[auto,1fr,1fr,1fr,1fr,1fr] h-full'
        style={{ gap: 0 }}
      >
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
                {getCoursesForSlot(day, hour).map((course, index, array) => (
                  <div
                    key={course.id}
                    className='border border-solid absolute overflow-hidden'
                    style={{
                      backgroundColor: course.color,
                      top: `${(course.startHour - hour) * 100}%`,
                      height: `${(course.endHour - course.startHour) * 100}%`,
                      width: `${70 / array.length}%`,
                      left: `${(index * 70) / array.length + 15}%`,
                      opacity: 0.7,
                    }}
                  >
                    <span className='text-xs whitespace-nowrap'>{`${course.major}${course.course_number}`}</span>
                  </div>
                ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
