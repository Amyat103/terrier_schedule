import React from 'react';
import CourseList from './components/CourseList';

function App() {
  return (
    <div className='App'>
      <header className='bg-blue-600 text-white p-4'>
        <h1 className='text-3xl font-bold text-center mt-8'>
          Terrier Schedule
        </h1>
      </header>
      <main className='container mx-auto mt-8 flex'>
        <div className='w-2/3'>
          <CourseList />
        </div>
        <div className='w-1/3 pl-8'>
          <p className='text-xl'>Selected courses will appear here</p>
        </div>
      </main>
    </div>
  );
}

export default App;
