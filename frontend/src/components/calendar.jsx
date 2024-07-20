import React from 'react';
import { useSchedule } from '../context/ScheduleContext';

function Calendar() {
  const { selectedCourses } = useSchedule();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  const timeToHour = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours + minutes / 60;
  };

  const shouldDisplayCourse = (day, hour, course) => {
    const courseDays = course.days.split('');
    const startHour = timeToHour(course.start_time);
    const endHour = timeToHour(course.end_time);
    return courseDays.includes(day[0]) && hour >= startHour && hour < endHour;
  };

  return (
    <div className='weekly-calendar'>
      <div className='grid grid-cols-6 gap-1'>
        <div className='col-start-2 col-span-5 grid grid-cols-5 gap-1'>
          {days.map((day) => (
            <div key={day} className='text-center font-bold'>
              {day}
            </div>
          ))}
        </div>
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className='text-right pr-2'>{`${hour}:00`}</div>
            {days.map((day) => (
              <div key={`${day}-${hour}`} className='border h-8 relative'>
                {selectedCourses.map(
                  (course) =>
                    shouldDisplayCourse(day, hour, course) && (
                      <div
                        key={course.id}
                        className='absolute inset-0 bg-blue-200 text-xs p-1 overflow-hidden'
                        style={{
                          top: `${
                            (timeToHour(course.start_time) - hour) * 100
                          }%`,
                          height: `${
                            (timeToHour(course.end_time) -
                              timeToHour(course.start_time)) *
                            100
                          }%`,
                        }}
                      >
                        {`${course.major}${course.course_number}`}
                      </div>
                    )
                )}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Calendar;
