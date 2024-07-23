import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://web-production-08125.up.railway.app/api';

const CHUNK_SIZE = 5000000;

const getDataVersion = async () => {
  try {
    const response = await axios.get(`${API_URL}/data-version/`);
    return response.data.version;
  } catch (error) {
    console.error('Error fetching data version:', error);
    return null;
  }
};

const chunkString = (str) => {
  const chunks = [];
  for (let i = 0; i < str.length; i += CHUNK_SIZE) {
    chunks.push(str.slice(i, i + CHUNK_SIZE));
  }
  return chunks;
};

const storeData = (key, data) => {
  const jsonString = JSON.stringify(data);
  const chunks = chunkString(jsonString);
  chunks.forEach((chunk, index) => {
    localStorage.setItem(`${key}_${index}`, chunk);
  });
  localStorage.setItem(`${key}_chunks`, chunks.length.toString());
};

const retrieveData = (key) => {
  const chunkCount = parseInt(localStorage.getItem(`${key}_chunks`), 10);
  if (isNaN(chunkCount)) return null;

  let jsonString = '';
  for (let i = 0; i < chunkCount; i++) {
    jsonString += localStorage.getItem(`${key}_${i}`) || '';
  }
  return JSON.parse(jsonString);
};

export const fetchCourses = async () => {
  try {
    const cachedVersion = localStorage.getItem('coursesVersion');
    const serverVersion = await getDataVersion();

    if (cachedVersion !== serverVersion) {
      console.log('Fetching fresh course data from server');
      const response = await axios.get(`${API_URL}/courses/`);
      storeData('coursesData', response.data);
      localStorage.setItem('coursesVersion', serverVersion);
      return response.data;
    } else {
      console.log('Using cached course data');
      return retrieveData('coursesData');
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
      storeData('sectionsData', sectionsByCourse);
      localStorage.setItem('sectionsVersion', serverVersion);
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
