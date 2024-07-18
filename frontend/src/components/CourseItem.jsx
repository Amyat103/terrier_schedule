import React from 'react';

function CourseItem() {
  return (
    <div className='course-item p-4 border rounded mb-2'>
      <h3 className='font-medium'>{CourseItem.title}</h3>
    </div>
  );
}

export default CourseItem;
