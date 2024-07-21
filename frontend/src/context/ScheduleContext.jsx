import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCourses, fetchSections } from '../api/course_fetch';

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [sectionColors, setSectionColors] = useState({});
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

  const addCourse = (section) => {
    setSelectedCourses((prevSelected) => [...prevSelected, section]);

    setSectionColors((prevColors) => {
      if (!prevColors[section.id]) {
        return {
          ...prevColors,
          [section.id]: `hsl(${Math.random() * 360}, 70%, 80%)`,
        };
      }
      return prevColors;
    });
  };

  const removeCourse = (courseId) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.filter((course) => course.id !== courseId)
    );
    // Optionally, remove the color when a course is removed
    setSectionColors((prevColors) => {
      const newColors = { ...prevColors };
      delete newColors[courseId];
      return newColors;
    });
  };

  return (
    <ScheduleContext.Provider
      value={{
        courses,
        sections,
        selectedCourses,
        sectionColors,
        addCourse,
        removeCourse,
        loading,
        error,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => useContext(ScheduleContext);
