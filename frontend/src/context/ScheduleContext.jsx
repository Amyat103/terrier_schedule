import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCourses, fetchSections } from '../api/course_fetch';

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const coursesData = await fetchCourses();
        const sectionsData = await fetchSections();

        console.log('Loaded courses data (first 3):', coursesData.slice(0, 3));
        console.log('Loaded sections data:', sectionsData);

        setCourses(coursesData);
        setSections(sectionsData);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err);
      }
    };
    loadData();
  }, []);

  return (
    <ScheduleContext.Provider value={{ courses, sections, loading, error }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);
