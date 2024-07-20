import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://web-production-08125.up.railway.app/api';
console.log('API_URL:', API_URL);

export const fetchCourses = async () => {
  try {
    console.log('Fetching courses from:', `${API_URL}/courses/`);
    const response = await axios.get(`${API_URL}/courses/`);
    console.log('Courses API Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    throw error;
  }
};

export const fetchSections = async () => {
  try {
    console.log('Fetching sections from:', `${API_URL}/sections/`);
    const response = await axios.get(`${API_URL}/sections/`);
    console.log('Sections API Response:', response);
    if (
      typeof response.data === 'string' &&
      response.data.includes('<!doctype html>')
    ) {
      throw new Error(
        'Received HTML instead of JSON. API endpoint might be incorrect.'
      );
    }

    // Organize sections by course_id
    const sectionsByCourse = response.data.reduce((acc, section) => {
      if (!acc[section.course_id]) {
        acc[section.course_id] = [];
      }
      acc[section.course_id].push(section);
      return acc;
    }, {});

    return sectionsByCourse;
  } catch (error) {
    console.error('Error fetching sections:', error);
    throw error;
  }
};
