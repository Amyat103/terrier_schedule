// ScheduleContext.jsx
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

  const addCourse = (course) => {
    console.log('Adding course to context:', course);
    setSelectedCourses((prevSelected) => {
      const newSelected = [...prevSelected, course];
      console.log('Updated Selected Courses in Context:', newSelected);
      return newSelected;
    });
  };

  const removeCourse = (courseId) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.filter((course) => course.id !== courseId)
    );
  };

  return (
    <ScheduleContext.Provider
      value={{
        courses,
        sections,
        selectedCourses,
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
