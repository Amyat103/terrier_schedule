import React from 'react';
import PropTypes from 'prop-types';

function ToggleButton({ label, checked, onChange }) {
  return (
    <label className='inline-flex items-center me-5 cursor-pointer'>
      <input
        type='checkbox'
        className='sr-only peer'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="relative w-11 h-6 bg-gray-200 rounded-full peer  dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-800"></div>
      <span className='ms-3 text-sm font-medium text-gray-900'>{label}</span>
    </label>
  );
}

ToggleButton.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ToggleButton;
