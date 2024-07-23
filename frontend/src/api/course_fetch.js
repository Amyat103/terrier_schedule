import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://web-production-08125.up.railway.app/api';

const CHUNK_SIZE = 1000;

const getDataVersion = async () => {
  try {
    const response = await axios.get(`${API_URL}/data-version/`);
    return response.data.version;
  } catch (error) {
    console.error('Error fetching data version:', error);
    return null;
  }
};

const storeDataInChunks = (key, data) => {
  const chunkedData = [];
  for (let i = 0; i < data.length; i += CHUNK_SIZE) {
    chunkedData.push(data.slice(i, i + CHUNK_SIZE));
  }
  chunkedData.forEach((chunk, index) => {
    localStorage.setItem(`${key}_${index}`, JSON.stringify(chunk));
  });
  localStorage.setItem(`${key}_chunkCount`, chunkedData.length.toString());
};

const getDataFromChunks = (key) => {
  const chunkCount = parseInt(localStorage.getItem(`${key}_chunkCount`), 10);
  let data = [];
  for (let i = 0; i < chunkCount; i++) {
    const chunk = JSON.parse(localStorage.getItem(`${key}_${i}`));
    data = data.concat(chunk);
  }
  return data;
};

export const fetchCourses = async () => {
  try {
    const cachedVersion = localStorage.getItem('coursesVersion');
    const serverVersion = await getDataVersion();

    if (cachedVersion !== serverVersion) {
      console.log('Fetching fresh course data from server');
      const response = await axios.get(`${API_URL}/courses/`);
      storeDataInChunks('coursesData', response.data);
      localStorage.setItem('coursesVersion', serverVersion);
      return response.data;
    } else {
      console.log('Using cached course data');
      return getDataFromChunks('coursesData');
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
      storeDataInChunks('sectionsData', Object.entries(sectionsByCourse));
      localStorage.setItem('sectionsVersion', serverVersion);
      return sectionsByCourse;
    } else {
      console.log('Using cached section data');
      const sectionEntries = getDataFromChunks('sectionsData');
      return Object.fromEntries(sectionEntries);
    }
  } catch (error) {
    console.error('Error fetching sections:', error);
    return {};
  }
};
