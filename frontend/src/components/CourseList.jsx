import React from 'react';
import React, {useState, useEffect}
from CourseItem import './CourseItem'

function CourseList() {
  const { courses, loading, errro } = useSchedule();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className='course-list'>
      <h2 className='text-xl font-semibold mb4'>Course List</h2>
    </div>
  );
}

export default CourseList;
