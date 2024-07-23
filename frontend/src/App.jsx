import CourseList from './components/CourseList';
import { useSchedule } from './context/ScheduleContext';
import rhett from '../assets/rhett.png';
import NewCalendar from './components/NewCalendar';
import ContactPopup from './components/ContactPopup';
import React, { useState } from 'react';

function App() {
  const { selectedCourses, removeCourse } = useSchedule();
  const [isContactPopupOpen, setIsContactPopupOpen] = useState(false);

  return (
    <div className='App flex flex-col h-screen'>
      <header className='bg-red-900 text-white p-1 w-full'>
        <div className='container mx-auto flex items-center justify-between'>
          <div className='w-1/3'></div>
          <div className='flex items-center group'>
            <h1 className='text-3xl font-bold text-center mr-4'>
              Terrier Schedule
            </h1>
            <img src={rhett} alt='Rhett' className='h-16 object-contain' />
          </div>
          <button
            onClick={() => setIsContactPopupOpen(true)}
            className='bg-white text-red-900 px-4 py-2 rounded hover:bg-gray-100'
          >
            Contact
          </button>
          <ContactPopup
            isOpen={isContactPopupOpen}
            onClose={() => setIsContactPopupOpen(false)}
          />
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
          <div className='flex flex-col items-center'>
            <h2 className='text-xl font-semibold mb-4'>Selected Courses</h2>
            <ul className='divide-y divide-gray-200 w-full px-4'>
              {selectedCourses.map((course) => (
                <li
                  key={course.id}
                  className='py-2 px-2 flex justify-between items-center hover:bg-gray-100 transition-colors duration-200'
                >
                  <span>{`${course.short_title} ${course.class_section}: ${course.class_type}`}</span>
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
