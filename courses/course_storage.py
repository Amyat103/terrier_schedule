from rest_framework import serializers


class CourseStore:
    _courses = None

    @classmethod
    def load_courses(cls):
        from .models import Course
        from .serializer import CourseSerializer

        courses = Course.objects.all()
        serializer = CourseSerializer(courses, many=True)
        cls._courses = serializer.data

    @classmethod
    def get_courses(cls):
        if cls._courses is None:
            cls.load_courses()
        return cls._courses
