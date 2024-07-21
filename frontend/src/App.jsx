import React from 'react';
import CourseList from './components/CourseList';
import { useSchedule } from './context/ScheduleContext';
import rhett from '../assets/rhett.png';
import NewCalendar from './components/NewCalendar';

function App() {
  const { selectedCourses, removeCourse } = useSchedule();

  return (
    <div className='App flex flex-col h-screen'>
      <header className='bg-red-900 text-white p-1 w-full'>
        <div className='container mx-auto flex items-center justify-center group'>
          <h1 className='text-3xl font-bold text-center mr-4'>
            Terrier Schedule
          </h1>
          <img src={rhett} alt='Rhett' className='h-16 object-contain' />
        </div>
      </header>
      <main className='flex-grow flex overflow-hidden'>
        <div className='w-1/2 p-4 overflow-hidden'>
          <CourseList />
        </div>
        <div className='w-1/2 p-4 overflow-auto'>
          <div className='mb-1'>
            <div className='bg-gray-200 p-1 text-center'>
              <NewCalendar />
            </div>
          </div>
          <div>
            <h2 className='text-xl font-semibold mb-4'>Selected Courses</h2>
            <ul>
              {selectedCourses.map((course) => (
                <li
                  key={course.id}
                  className='mb-2 flex justify-between items-center'
                >
                  <span>{`${course.major}${course.course_number}: ${course.short_title}`}</span>
                  <button
                    onClick={() => removeCourse(course.id)}
                    className='hover:bg-red-800 bg-red-700 text-white px-2 py-1 rounded'
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
