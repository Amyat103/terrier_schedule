import React from 'react';
import CourseList from './components/CourseList';
import SelectedCourses from './components/SelectedCourses';
import { useSchedule } from './context/ScheduleContext';
import rhett from '../assets/rhett.png';
import Calendar from './components/Calendar';

function App() {
  const { selectedCourses, toggleCourseSelection } = useSchedule();

  return (
    <div className='App flex flex-col h-screen'>
      <header className='bg-red-900 text-white p-4 w-full'>
        <div className='container mx-auto flex items-center justify-center group hover:bg-red-800 transition-colors duration-300 cursor-pointer'>
          <h1 className='text-3xl font-bold text-center mr-4 group-hover:text-blue-200'>
            Terrier Schedule
          </h1>
          <img
            src={rhett}
            alt='Rhett'
            className='h-16 object-contain group-hover:opacity-90'
          />
        </div>
      </header>
      <main className='flex-grow flex overflow-hidden'>
        <div className='w-1/2 p-4 overflow-hidden'>
          <CourseList />
        </div>
        <div className='w-1/2 p-4 overflow-auto'>
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Calendar</h2>
            <div className='bg-gray-200 p-4 text-center'>
              <Calendar />
            </div>
          </div>
          <SelectedCourses
            courses={selectedCourses}
            onRemove={toggleCourseSelection}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
