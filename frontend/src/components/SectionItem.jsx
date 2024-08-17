import { useSchedule } from '../context/ScheduleContext';
import PropTypes from 'prop-types';
import rmpLogo from '../../assets/rmp_logo.svg?v=1';

const ExternalLinkIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='inline-block ml-1'
  >
    <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'></path>
    <polyline points='15 3 21 3 21 9'></polyline>
    <line x1='10' y1='14' x2='21' y2='3'></line>
  </svg>
);

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

  const getRatingColor = (score, isDifficulty = false) => {
    if (score === null || score === undefined) return '#888888';
    if (!isDifficulty) {
      if (score > 3.5) return '#006400';
      if (score >= 2.5) return '#FFA500';
      return '#B91C1C';
    } else {
      if (score < 2.5) return '#006400';
      if (score <= 3.5) return '#FFA500';
      return '#B91C1C';
    }
  };

  const handleToggle = () => {
    if (isSelected) {
      removeCourse(section.id);
    } else {
      addCourse(section);
    }
  };

  const hasRmpData =
    section.professor_overall_quality !== null &&
    section.professor_difficulty !== null;

  return (
    <div className='section-item p-2 border rounded flex flex-col h-full hover:bg-gray-100 transition-colors duration-200 text-sm'>
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
        <div>
          <p className='font-semibold flex items-center'>
            Rate My Professor
            <img src={rmpLogo} alt='RMP Logo' className='h-4 ml-1' />
          </p>
          {hasRmpData ? (
            <div className='flex flex-wrap gap-2 mt-1'>
              <span
                className='px-2 py-1 rounded-full text-xs text-white inline-block'
                style={{
                  backgroundColor: getRatingColor(
                    section.professor_overall_quality,
                    false
                  ),
                }}
              >
                Quality: {section.professor_overall_quality.toFixed(1)}
              </span>
              <span
                className='px-2 py-1 rounded-full text-xs text-white inline-block'
                style={{
                  backgroundColor: getRatingColor(
                    section.professor_difficulty,
                    true
                  ),
                }}
              >
                Difficulty: {section.professor_difficulty.toFixed(1)}
              </span>
              {section.professor_link && (
                <a
                  href={section.professor_link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-600 hover:underline'
                >
                  RMP Link
                  <ExternalLinkIcon />
                </a>
              )}
            </div>
          ) : (
            <p className='text-gray-500 text-xs'>Not Available</p>
          )}
        </div>
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
    professor_overall_quality: PropTypes.number,
    professor_difficulty: PropTypes.number,
    professor_link: PropTypes.string,
  }).isRequired,
};

export default SectionItem;
