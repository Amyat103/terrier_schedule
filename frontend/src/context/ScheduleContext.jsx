import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCourses, fetchSections } from '../api/courseApi';

const ScheduleContext = createContext();

function ScheduleProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const LoadData = async () => {
      try {
        const [coursesData, sectionsData] = await Promise.all([
          fetchCourses(),
          fetchSections(),
        ]);
        setCourses(coursesData);
        setSections(sectionsData);
        setLoading(false);
      } catch (err) {
        setError('Cant load data in ScheduleContext.jsx');
        setLoading(false);
      }
    };
    LoadData();
  }, []);

  return (
    <ScheduleContext.Provider value={{ courses, sections, loading, error }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export default ScheduleProvider;
