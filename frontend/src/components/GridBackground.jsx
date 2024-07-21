import React from 'react';
import { dayOrder } from '../utils/calendarUtils';

const hours = Array.from({ length: 14 }, (_, i) => i + 8);

function GridBackground() {
  return (
    <>
      {dayOrder.map((day, index) => (
        <div
          key={day}
          className={`grid grid-rows-[auto,repeat(14,1fr)] border-l ${
            index % 2 === 0 ? 'bg-gray-50' : ''
          }`}
        >
          <div className='text-center font-bold py-2'>{day}</div>
          {hours.map((hour) => (
            <div key={hour} className='border-t'></div>
          ))}
        </div>
      ))}
    </>
  );
}

export default React.memo(GridBackground);
