export const timeToMinutes = (timeString) => {
  console.log('Converting time:', timeString);
  const [time, period] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period.toLowerCase() === 'pm' && hours !== 12) {
    hours += 12;
  } else if (period.toLowerCase() === 'am' && hours === 12) {
    hours = 0;
  }
  const result = hours * 60 + minutes;
  return result;
};

export const minutesToGridRow = (minutes) => {
  return Math.floor((minutes - 480) / 30) * 2 + 1;
};

export const dayOrder = ['Mo', 'Tu', 'We', 'Th', 'Fr'];

export const groupCoursesByDay = (courses) => {
  const grouped = courses.reduce((acc, course) => {
    const days = course.days.match(/.{2}/g) || [];
    days.forEach((day) => {
      if (!acc[day]) acc[day] = [];
      acc[day].push(course);
    });
    return acc;
  }, {});
  return grouped;
};

export const sortAndGroupOverlappingCourses = (courses) => {
  const sortedCourses = courses.sort(
    (a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time)
  );

  const groups = [];
  sortedCourses.forEach((course) => {
    const overlappingGroup = groups.find((group) =>
      group.some(
        (groupCourse) =>
          timeToMinutes(groupCourse.start_time) <
            timeToMinutes(course.end_time) &&
          timeToMinutes(course.start_time) < timeToMinutes(groupCourse.end_time)
      )
    );

    if (overlappingGroup) {
      overlappingGroup.push(course);
    } else {
      groups.push([course]);
    }
  });

  return groups;
};
