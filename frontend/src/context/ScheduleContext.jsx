// ScheduleContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCourses, fetchSections } from '../api/course_fetch';

const ScheduleContext = createContext();

function ScheduleProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [coursesData, sectionsData] = await Promise.all([
          fetchCourses(),
          fetchSections(),
        ]);

        // Create a map of course_id to sections for faster lookup
        const sectionsByCourseId = sectionsData.reduce((acc, section) => {
          if (!acc[section.course_id]) {
            acc[section.course_id] = [];
          }
          acc[section.course_id].push(section);
          return acc;
        }, {});

        setCourses(coursesData);
        setSections(sectionsByCourseId);
        setLoading(false);
      } catch (err) {
        console.error('Error in ScheduleContext:', err);
        setError(err.message || 'Failed to load data');
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <ScheduleContext.Provider value={{ courses, sections, loading, error }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export const useSchedule = () => useContext(ScheduleContext);
export default ScheduleProvider;
