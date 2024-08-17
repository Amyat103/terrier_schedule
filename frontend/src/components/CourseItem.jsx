import React from 'react';
import { MemoizedSectionList } from './SectionList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const hubColors = {
  'Philosophical Inquiry Life (PLM)': '#FF5733',
  'Aesthetic Exploration (AEX)': '#33e057',
  'Historical Consciousness (HCO)': '#3357FF',
  'Scientific Inquiry I (SI1)': '#ffcc33',
  'Scientific Inquiry II (SI2)': '#33dff5',
  'Social Inquiry I (SO1)': '#d1e333',
  'Social Inquiry II (SO2)': '#FF8033',
  'Quantitative Reasoning I (QR1)': '#8033FF',
  'Quantitative Reasoning II (QR2)': '#13d833',
  'Individual in Community (IIC)': '#FF3380',
  'Global Citizensh/Intercult Literacy (GCI)': '#40b0b0',
  'Ethical Reasoning (ETR)': '#3380FF',
  'First-Year Writing Seminar (FYW)': '#FF3333',
  'Writing, Research, and Inquiry (WRI)': '#cf5a98',
  'Writing-Intensive Course (WIN)': '#6289f3',
  'Oral and/or Signed Communication (OSC)': '#f6de5f',
  'Digital/Multimedia Expression (DME)': '#33deff',
  'Critical Thinking (CRT)': '#FF33FF',
  'Rsch Information Literacy (RIL)': '#FFAA33',
  'Teamwork/Collaboration (TWC)': '#2bd653',
  'Creativity/Innovation (CRI)': '#AA33FF',
};

const getHubColor = (attr) => {
  const colorKey = Object.keys(hubColors).find((key) =>
    key.toLowerCase().startsWith(attr.toLowerCase())
  );
  return colorKey ? hubColors[colorKey] : '#888888';
};

function CourseItem({ course, isExpanded, onExpand }) {
  return (
    <div className='course-item border rounded mb-2 relative'>
      <div
        className='p-2 cursor-pointer hover:bg-gray-100 transition-colors duration-300'
        onClick={() => onExpand(course.course_id)}
      >
        <div className='course-header flex justify-between items-center'>
          <h3 className='font-bold text-lg'>
            {course.major} {course.course_number}: {course.short_title}
          </h3>
          <div className='flex items-center space-x-2'>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                course.is_registerable
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}
            >
              {course.is_registerable ? 'Registrable' : 'Not Registrable'}
            </span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-red-600 text-lg transition-transform duration-300 ease-in-out ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px]' : 'max-h-0'
        }`}
      >
        <div className='px-4 pb-4'>
          <h4 className='font-bold text-sm mt-2 mb-1'>HUB</h4>
          <div className='flex flex-wrap gap-2'>
            {course.hub_attributes && course.hub_attributes.length > 0 ? (
              course.hub_attributes.map((attr, index) => (
                <span
                  key={index}
                  className='px-2 py-1 rounded-full text-xs text-white inline-block mb-1'
                  style={{ backgroundColor: getHubColor(attr) }}
                >
                  {attr}
                </span>
              ))
            ) : (
              <span
                className='px-2 py-1 rounded-full text-xs text-white inline-block mb-1'
                style={{ backgroundColor: '#888888' }}
              >
                No HUB attributes
              </span>
            )}
          </div>
        </div>
        <div className='px-4 pb-4'>
          <h4 className='font-bold text-sm mt-2 mb-1'>Description</h4>
          <p className='text-gray-700 mb-4 text-sm'>{course.description}</p>
          <MemoizedSectionList courseId={course.course_id} />
        </div>
      </div>
    </div>
  );
}

CourseItem.propTypes = {
  course: PropTypes.shape({
    course_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    major: PropTypes.string.isRequired,
    course_number: PropTypes.string.isRequired,
    short_title: PropTypes.string.isRequired,
    is_registerable: PropTypes.bool.isRequired,
    description: PropTypes.string.isRequired,
    hub_attributes: PropTypes.string,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func.isRequired,
};

export const MemoizedCourseItem = React.memo(CourseItem);
