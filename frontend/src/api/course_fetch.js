import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://web-production-08125.up.railway.app/api';
console.log('API_URL:', API_URL);

const getDataVersion = async () => {
  try {
    const response = await axios.get(`${API_URL}/data-version/`);
    return response.data.version;
  } catch (error) {
    console.error('Error fetching data version:', error);
    return null;
  }
};

export const fetchCourses = async () => {
  try {
    const cachedVersion = localStorage.getItem('coursesVersion');
    const serverVersion = await getDataVersion();

    if (cachedVersion !== serverVersion) {
      console.log('Fetching fresh course data from server');
      const response = await axios.get(`${API_URL}/courses/`);
      localStorage.setItem('coursesData', JSON.stringify(response.data));
      localStorage.setItem('coursesVersion', serverVersion);
      return response.data;
    } else {
      console.log('Using cached course data');
      return JSON.parse(localStorage.getItem('coursesData'));
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const fetchSections = async () => {
  try {
    const cachedVersion = localStorage.getItem('sectionsVersion');
    const serverVersion = await getDataVersion();

    if (cachedVersion !== serverVersion) {
      console.log('Fetching fresh section data from server');
      const response = await axios.get(`${API_URL}/sections/`);
      const sectionsByCourse = response.data.reduce((acc, section) => {
        if (!acc[section.course_id]) {
          acc[section.course_id] = [];
        }
        acc[section.course_id].push(section);
        return acc;
      }, {});
      localStorage.setItem('sectionsData', JSON.stringify(sectionsByCourse));
      localStorage.setItem('sectionsVersion', serverVersion);
      return sectionsByCourse;
    } else {
      console.log('Using cached section data');
      return JSON.parse(localStorage.getItem('sectionsData'));
    }
  } catch (error) {
    console.error('Error fetching sections:', error);
    return {};
  }
};
