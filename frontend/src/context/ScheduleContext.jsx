import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCourses, fetchSections } from '../api/course_fetch';

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
        console.error('Error in ScheduleContext:', err);
        setError(err.message || 'Failed to load data');
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

export const useSchedule = () => useContext(ScheduleContext);
export default ScheduleProvider;
