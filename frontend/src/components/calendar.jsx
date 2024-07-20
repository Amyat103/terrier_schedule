// import React from 'react';
// import { useSchedule } from '../context/ScheduleContext';
// import '../styles.css';

// function Calendar() {
//   const { selectedCourses } = useSchedule();
//   const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
//   const hours = [...Array(8).keys()].map((i) => i * 2 + 8);

//   const timeToHour = (timeStr) => {
//     const [hours, minutes] = timeStr.split(':').map(Number);
//     return hours + minutes / 60;
//   };

//   const formatHour = (hour) => {
//     const ampm = hour >= 12 ? 'PM' : 'AM';
//     const formattedHour = hour % 12 || 12;
//     return `${formattedHour} ${ampm}`;
//   };

//   const shouldDisplayCourse = (day, hour, course) => {
//     const courseDays = course.days.split('');
//     const startHour = timeToHour(course.start_time);
//     const endHour = timeToHour(course.end_time);
//     return courseDays.includes(day[0]) && hour >= startHour && hour < endHour;
//   };

//   return (
//     <div className='h-full'>
//       <div className='weekly-calendar h-full overflow-hidden'>
//         <div className='grid grid-cols-[auto,1fr,1fr,1fr,1fr,1fr] h-full'>
//           <div className='col-start-2 col-span-5 grid grid-cols-5'>
//             {days.map((day) => (
//               <div key={day} className='text-center font-bold'>
//                 {day}
//               </div>
//             ))}
//           </div>
//           {hours.map((hour) => (
//             <React.Fragment key={hour}>
//               <div className='flex items-center justify-end pr-2 h-full'>
//                 {formatHour(hour)}
//               </div>
//               {days.map((day) => (
//                 <div
//                   key={`${day}-${hour}`}
//                   className='border h-full relative custom-dotted-border custom-vertical-dotted-line'
//                 >
//                   <div className='custom-dotted-line'></div>
//                   {selectedCourses.map(
//                     (course) =>
//                       shouldDisplayCourse(day, hour, course) && (
//                         <div
//                           key={course.id}
//                           className='bg-blue-200 border border-solid border-blue-400 absolute col-span-1'
//                           style={{
//                             top: `${
//                               (timeToHour(course.start_time) - hour) * 100
//                             }%`,
//                             height: `${
//                               (timeToHour(course.end_time) -
//                                 timeToHour(course.start_time)) *
//                               100
//                             }%`,
//                           }}
//                         >
//                           {`${course.major}${course.course_number}`}
//                         </div>
//                       )
//                   )}
//                 </div>
//               ))}
//             </React.Fragment>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Calendar;
import React from 'react';
import { useSchedule } from '../context/ScheduleContext';
import '../styles.css';

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

  const shouldDisplayCourse = (day, hour, course) => {
    const courseDays = course.days.split('');
    const startHour = timeToHour(course.start_time);
    const endHour = timeToHour(course.end_time);
    return courseDays.includes(day[0]) && hour >= startHour && hour < endHour;
  };

  return (
    <div className='h-full'>
      <div className='weekly-calendar h-full'>
        <div className='grid grid-cols-[auto,1fr,1fr,1fr,1fr,1fr] h-full'>
          <div className='col-start-2 col-span-5 grid grid-cols-5'>
            {days.map((day) => (
              <div key={day} className='text-center font-bold'>
                {day}
              </div>
            ))}
          </div>
          {hours.map((hour) => (
            <React.Fragment key={hour}>
              <div className='flex items-center justify-end pr-2 h-full'>
                {formatHour(hour)}
              </div>
              {days.map((day) => (
                <div
                  key={`${day}-${hour}`}
                  className='border h-full relative custom-dotted-border custom-vertical-dotted-line'
                >
                  <div className='custom-dotted-line'></div>
                  {selectedCourses.map(
                    (course) =>
                      shouldDisplayCourse(day, hour, course) && (
                        <div
                          key={course.id}
                          className='bg-blue-200 border border-solid border-blue-400 absolute col-span-1'
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
    </div>
  );
}

export default Calendar;
