// import React, { useMemo } from 'react';
// import { useSchedule } from '../context/ScheduleContext';
// import {
//   dayOrder,
//   groupCoursesByDay,
//   sortAndGroupOverlappingCourses,
// } from '../utils/calendarUtils';
// import GridBackground from './GridBackground';
// import CourseCard from './CourseCard';

// function Calendar() {
//   const { selectedCourses } = useSchedule();

//   console.log('Calendar rendering, selectedCourses:', selectedCourses);

//   const coursesByDay = useMemo(() => {
//     console.log('Grouping courses by day');
//     return groupCoursesByDay(selectedCourses);
//   }, [selectedCourses]);

//   const groupedCoursesByDay = useMemo(() => {
//     console.log('Sorting and grouping overlapping courses');
//     const grouped = {};
//     Object.entries(coursesByDay).forEach(([day, courses]) => {
//       grouped[day] = sortAndGroupOverlappingCourses(courses);
//     });
//     return grouped;
//   }, [coursesByDay]);

//   return (
//     <div className='grid grid-cols-[auto,repeat(5,1fr)] h-full relative'>
//       <GridBackground />
//       <div className='absolute inset-0 grid grid-cols-5'>
//         {dayOrder.map((day) => (
//           <div key={day} className='relative'>
//             {groupedCoursesByDay[day]?.map((group, groupIndex) => (
//               <div key={groupIndex} className='absolute inset-0'>
//                 {group.map((course, courseIndex) => (
//                   <CourseCard
//                     key={course.id}
//                     course={course}
//                     index={courseIndex}
//                     groupSize={group.length}
//                   />
//                 ))}
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Calendar;
