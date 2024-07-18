import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchCourses = async () => {
  try {
    console.log('Fetching courses from:', `${API_URL}/courses/`);
    const response = await axios.get(`${API_URL}/courses/`);
    console.log('Courses API Response:', response);
    if (
      typeof response.data === 'string' &&
      response.data.includes('<!doctype html>')
    ) {
      throw new Error(
        'Received HTML instead of JSON. API endpoint might be incorrect.'
      );
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
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
    return response.data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    throw error;
  }
};
