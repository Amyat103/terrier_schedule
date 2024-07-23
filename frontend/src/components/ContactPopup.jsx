import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

function ContactPopup({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 1000;

  useEffect(() => {
    setCharCount(message.length);
  }, [message]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending message:', { email, message });
      const response = await axios.post('/api/send-contact-email/', {
        email,
        message,
      });
      console.log('Response:', response);
      if (response.data.status === 'success') {
        alert('Message sent successfully!');
        setEmail('');
        setMessage('');
        onClose();
      } else {
        console.error('Error response:', response.data);
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
      <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
        <div className='mt-3 text-center'>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            Contact Me
          </h3>
          <div className='mt-2 px-7 py-3'>
            <p className='text-sm text-gray-500'>
              Email me at amyat@bu.edu or fill out the form below
            </p>
            <form onSubmit={handleSubmit} className='mt-4'>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Your email'
                required
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 text-black' // Added text-black here
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, maxChars))}
                placeholder='Your message'
                required
                maxLength={maxChars}
                className='w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-700 text-black' // Added text-black here
                rows='4'
              />
              <div className='text-right text-sm text-gray-500'>
                {charCount}/{maxChars}
              </div>
              <button
                type='submit'
                className='w-full mt-2 px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700'
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
        <button
          onClick={onClose}
          className='absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600'
        >
          <span className='text-2xl'>&times;</span>
        </button>
      </div>
    </div>
  );
}

ContactPopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ContactPopup;
