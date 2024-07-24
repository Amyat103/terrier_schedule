import axios from 'axios';
import LZString from 'lz-string';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://web-production-08125.up.railway.app/api';

// const CHUNK_SIZE = 1000000;
let memoryStorage = {};

const getDataVersion = async () => {
  try {
    const response = await axios.get(`${API_URL}/data-version/`);
    console.log('Sections API response:', response.data);
    return response.data.version;
  } catch (error) {
    console.error('Error fetching data version:', error);
    return null;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(
      `Failed to set ${key} in localStorage. Falling back to memory storage.`
    );
    memoryStorage[key] = value;
    return false;
  }
};

const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key) || memoryStorage[key];
  } catch (e) {
    return memoryStorage[key];
  }
};

// const storeData = (key, data) => {
//   const jsonString = JSON.stringify(data);
//   const chunks = [];
//   for (let i = 0; i < jsonString.length; i += CHUNK_SIZE) {
//     chunks.push(jsonString.slice(i, i + CHUNK_SIZE));
//   }
//   chunks.forEach((chunk, index) => {
//     safeSetItem(`${key}_${index}`, chunk);
//   });
//   safeSetItem(`${key}_chunks`, chunks.length.toString());
// };
const storeData = (key, data) => {
  try {
    const jsonString = JSON.stringify(data);
    const compressed = LZString.compress(jsonString);
    localStorage.setItem(key, compressed);
    return true;
  } catch (e) {
    console.warn(`Failed to store ${key} in localStorage: ${e.message}`);
    return false;
  }
};

const retrieveData = (key) => {
  try {
    const compressed = localStorage.getItem(key);
    if (!compressed) return null;
    const jsonString = LZString.decompress(compressed);
    return JSON.parse(jsonString);
  } catch (e) {
    console.error(
      `Failed to retrieve or parse ${key} from localStorage: ${e.message}`
    );
    return null;
  }
};

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
    if (!Array.isArray(response.data)) {
      console.error('Unexpected data format for sections:', response.data);
      return {};
    }
    console.log('Raw sections data:', response.data.slice(0, 3));
    const sectionsByCourse = response.data.reduce((acc, section) => {
      if (!acc[section.course_id]) {
        acc[section.course_id] = [];
      }
      acc[section.course_id].push(section);
      return acc;
    }, {});
    console.log(
      'Organized sections (first 3 courses):',
      Object.keys(sectionsByCourse)
        .slice(0, 3)
        .reduce((acc, key) => {
          acc[key] = sectionsByCourse[key];
          return acc;
        }, {})
    );
    return sectionsByCourse;
  } catch (error) {
    console.error('Error fetching sections:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return {};
  }
};
