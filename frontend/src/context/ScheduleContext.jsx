import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCourses, fetchSections } from '../api/course_fetch';

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const coursesData = await fetchCourses();
        const sectionsData = await fetchSections();

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

  const toggleCourseSelection = (section) => {
    setSelectedCourses((prevSelected) => {
      const isAlreadySelected = prevSelected.some((s) => s.id === section.id);
      if (isAlreadySelected) {
        return prevSelected.filter((s) => s.id !== section.id);
      } else {
        return [...prevSelected, section];
      }
    });
  };

  return (
    <ScheduleContext.Provider
      value={{
        courses,
        sections,
        selectedCourses,
        toggleCourseSelection,
        loading,
        error,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);
