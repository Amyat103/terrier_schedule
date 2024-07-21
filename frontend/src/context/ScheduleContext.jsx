import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchCourses, fetchSections } from '../api/course_fetch';

const ScheduleContext = createContext();

export const ScheduleProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [courseColors, setCourseColors] = useState({});
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
    setSelectedCourses((prevSelected) => {
      const newCourse = {
        ...course,
        days: course.days || '',
        start_time: course.start_time || '',
        end_time: course.end_time || '',
      };
      return [...prevSelected, newCourse];
    });

    setCourseColors((prevColors) => {
      if (!prevColors[course.course_id]) {
        return {
          ...prevColors,
          [course.course_id]: `hsl(${Math.random() * 360}, 70%, 80%)`,
        };
      }
      return prevColors;
    });
  };

  const removeCourse = (courseId) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.filter((course) => course.id !== courseId)
    );
    // Optionally, you can also remove the color when a course is removed
    // setCourseColors((prevColors) => {
    //   const newColors = {...prevColors};
    //   delete newColors[courseId];
    //   return newColors;
    // });
  };

  return (
    <ScheduleContext.Provider
      value={{
        courses,
        sections,
        selectedCourses,
        courseColors,
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
