import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://web-production-08125.up.railway.app/api';

// const CHUNK_SIZE = 1000000;
let memoryStorage = {};

const getDataVersion = async () => {
  try {
    const response = await axios.get(`${API_URL}/data-version/`);
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
    localStorage.setItem(key, jsonString);
    return true;
  } catch (e) {
    console.warn(`Failed to store ${key} in localStorage: ${e.message}`);
    return false;
  }
};

const retrieveData = (key) => {
  try {
    const jsonString = localStorage.getItem(key);
    return jsonString ? JSON.parse(jsonString) : null;
  } catch (e) {
    console.error(
      `Failed to retrieve or parse ${key} from localStorage: ${e.message}`
    );
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
      const success = storeData('coursesData', response.data);
      if (success) {
        localStorage.setItem('coursesVersion', serverVersion);
      }
      return response.data;
    } else {
      console.log('Using cached course data');
      return retrieveData('coursesData');
    }
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

export const fetchSections = async () => {
  try {
    const cachedVersion = safeGetItem('sectionsVersion');
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
      storeData('sectionsData', sectionsByCourse);
      safeSetItem('sectionsVersion', serverVersion);
      return sectionsByCourse;
    } else {
      console.log('Using cached section data');
      return retrieveData('sectionsData');
    }
  } catch (error) {
    console.error('Error fetching sections:', error);
    return {};
  }
};
