import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = import.meta.env.VITE_API_URL;

export const fetchCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const fetchSections = async () => {
  try {
    const response = await axios.get(`${API_URL}/sections/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    throw error;
  }
};
