import React from 'react';
import PropTypes from 'prop-types';

function ToggleButton({ label, checked, onChange }) {
  return (
    <label className='flex items-center cursor-pointer'>
      <div className='relative'>
        <input
          type='checkbox'
          className='sr-only'
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={`w-10 h-4 bg-gray-400 rounded-full shadow-inner ${
            checked ? 'bg-red-800' : ''
          }`}
        ></div>
        <div
          className={`absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition ${
            checked ? 'transform translate-x-full bg-red-800' : ''
          }`}
        ></div>
      </div>
      <div className='ml-3 text-gray-700 font-medium'>{label}</div>
    </label>
  );
}

ToggleButton.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ToggleButton;
