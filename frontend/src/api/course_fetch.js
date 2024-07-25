import axios from 'axios';
import LZString from 'lz-string';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://web-production-08125.up.railway.app/api';

let memoryStorage = {};

const API_SECRET_KEY = import.meta.env.API_SECRET_KEY || '';

const getHeaders = () => {
  const headers = {};
  if (API_SECRET_KEY) {
    headers['Authorization'] = `Bearer ${API_SECRET_KEY}`;
  }
  console.log('Request headers:', headers);
  return headers;
};

const getDataVersion = async () => {
  try {
    const response = await axios.get(`${API_URL}/data-version/`, {
      headers: getHeaders(),
    });
    console.log('Data version response:', response.data);
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

const storeData = (key, data) => {
  try {
    const jsonString = JSON.stringify(data);
    const compressed = LZString.compress(jsonString);
    return safeSetItem(key, compressed);
  } catch (e) {
    console.warn(`Failed to store ${key}: ${e.message}`);
    return false;
  }
};

const retrieveData = (key) => {
  try {
    const compressed = safeGetItem(key);
    if (!compressed) return null;
    const jsonString = LZString.decompress(compressed);
    return JSON.parse(jsonString);
  } catch (e) {
    console.error(`Failed to retrieve or parse ${key}: ${e.message}`);
    return null;
  }
};

export const fetchCourses = async () => {
  try {
    const cachedVersion = safeGetItem('coursesVersion');
    const serverVersion = await getDataVersion();
    console.log(
      'Courses - Cached version:',
      cachedVersion,
      'Server version:',
      serverVersion
    );

    if (cachedVersion !== serverVersion) {
      console.log('Fetching fresh course data from server');
      console.log('Fetching fresh course data from server');
      const response = await axios.get(`${API_URL}/courses/`, {
        headers: getHeaders(),
      });
      console.log('Courses API Response:', response);
      const success = storeData('coursesData', response.data);
      if (success) {
        safeSetItem('coursesVersion', serverVersion);
      }
      return response.data;
    } else {
      console.log('Using cached course data');
      return retrieveData('coursesData');
    }
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
    return [];
  }
};

export const fetchSections = async () => {
  try {
    const cachedVersion = safeGetItem('sectionsVersion');
    const serverVersion = await getDataVersion();
    console.log(
      'Sections - Cached version:',
      cachedVersion,
      'Server version:',
      serverVersion
    );

    if (cachedVersion !== serverVersion) {
      console.log('Fetching fresh section data from server');
      const response = await axios.get(`${API_URL}/sections/`, {
        headers: getHeaders(),
      });
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
      const success = storeData('sectionsData', sectionsByCourse);
      if (success) {
        safeSetItem('sectionsVersion', serverVersion);
      }
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
    } else {
      console.log('Using cached section data');
      return retrieveData('sectionsData');
    }
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
