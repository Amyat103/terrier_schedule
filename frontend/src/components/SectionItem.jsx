import { useSchedule } from '../context/ScheduleContext';
import PropTypes from 'prop-types';

function SectionItem({ section }) {
  const { addCourse, removeCourse, selectedCourses } = useSchedule();
  const isSelected = selectedCourses.some((s) => s.id === section.id);
  const availabilityPercentage =
    (section.enrollment_available / section.class_capacity) * 100;

  const getAvailabilityColor = () => {
    if (availabilityPercentage >= 70) return 'text-red-700';
    if (availabilityPercentage <= 30) return 'text-red-700';
    return 'text-orange-500';
  };

  const handleToggle = () => {
    if (isSelected) {
      removeCourse(section.id);
    } else {
      console.log('Adding course (full object):', section);
      addCourse(section);
    }
  };

  return (
    <div className='section-item p-2 border rounded flex flex-col h-full hover:bg-gray-100 transition-colors duration-200'>
      <div className='flex-grow'>
        <p>
          <span className='font-semibold'>Section:</span>{' '}
          {section.class_section}
        </p>
        <p>
          <span className='font-semibold'>Type:</span> {section.class_type}
        </p>
        <p>
          <span className='font-semibold'>Professor:</span>{' '}
          {section.professor_name}
        </p>
        <p>
          <span className='font-semibold'>Time:</span> {section.days}{' '}
          {section.start_time} - {section.end_time}
        </p>
        <p>
          <span className='font-semibold'>Location:</span> {section.location}
        </p>
        <p>
          <span className='font-semibold'>Availability:</span>{' '}
          <span className={getAvailabilityColor()}>
            {section.enrollment_available}/{section.class_capacity}
          </span>
        </p>
      </div>
      <button
        onClick={handleToggle}
        className={`mt-2 w-full px-2 py-1 text-white rounded transition-colors ${
          isSelected
            ? 'bg-red-700 hover:bg-red-800'
            : 'bg-red-700 hover:bg-red-800'
        }`}
      >
        {isSelected ? 'Remove' : 'Add'}
      </button>
    </div>
  );
}

SectionItem.propTypes = {
  section: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    class_section: PropTypes.string.isRequired,
    class_type: PropTypes.string.isRequired,
    professor_name: PropTypes.string.isRequired,
    days: PropTypes.string.isRequired,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    location: PropTypes.string.isRequired,
    enrollment_available: PropTypes.number.isRequired,
    class_capacity: PropTypes.number.isRequired,
  }).isRequired,
};

export default SectionItem;
