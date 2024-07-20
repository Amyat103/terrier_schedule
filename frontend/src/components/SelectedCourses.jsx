import React from 'react';

function SelectedCourses({ courses, onRemove }) {
  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Selected Courses</h2>
      {courses.length === 0 ? (
        <p>No courses selected</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li
              key={course.id}
              className='mb-2 p-2 bg-gray-100 rounded flex justify-between items-center'
            >
              <div>
                <h3 className='font-medium'>{`${course.major.substring(0, 3)}${
                  course.course_number
                }`}</h3>
                <p>{`${course.days} ${course.start_time} - ${course.end_time}`}</p>
              </div>
              <button
                onClick={() => onRemove(course)}
                className='px-2 py-1 bg-red-500 text-white rounded'
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SelectedCourses;
