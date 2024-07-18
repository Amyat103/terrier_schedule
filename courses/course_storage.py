import json

from django.db import connection
from django.utils import timezone
from rest_framework import serializers

from .models import Course, Section, StoredCourse, StoredSection
from .serializer import CourseSerializer, SectionSerializer


class CourseStorage:
    _courses = None
    _sections = None
    _last_updated = None

    @classmethod
    def load_courses(cls):
        print("Loading courses and sections...")
        courses = Course.objects.all()
        sections = Section.objects.all()

        course_serializer = CourseSerializer(courses, many=True)
        section_serializer = SectionSerializer(sections, many=True)

        cls._courses = course_serializer.data
        cls._sections = section_serializer.data
        cls._last_updated = timezone.now()

        print(f"Loaded {len(cls._courses)} courses and {len(cls._sections)} sections")
        print("First course:", cls._courses[0] if cls._courses else "No courses")
        print("First section:", cls._sections[0] if cls._sections else "No sections")

    @staticmethod
    def fetch_and_store_data():
        print("Starting to fetch data...")
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM courses_course")
            columns = [col[0] for col in cursor.description]
            courses = [dict(zip(columns, row)) for row in cursor.fetchall()]
            print(f"Fetched {len(courses)} courses from database")

            cursor.execute("SELECT * FROM courses_section")
            columns = [col[0] for col in cursor.description]
            sections = [dict(zip(columns, row)) for row in cursor.fetchall()]
            print(f"Fetched {len(sections)} sections from database")

        StoredCourse.objects.all().delete()
        for course in courses:
            StoredCourse.objects.create(course_id=course["id"], data=course)
        print(f"Stored {len(courses)} courses")

        StoredSection.objects.all().delete()
        for section in sections:
            StoredSection.objects.create(section_id=section["id"], data=section)
        print(f"Stored {len(sections)} sections")

    @staticmethod
    def get_courses(cls):
        try:
            courses = StoredCourse.objects.all()
            return [course.data for course in courses]
        except Exception as e:
            logger.error(f"Error fetching courses: {str(e)}")
            return []

    @staticmethod
    def get_sections():
        sections = [section.data for section in StoredSection.objects.all()]
        print(f"Retrieved {len(sections)} sections from StoredSection")
        return sections

    @staticmethod
    def print_stored_data():
        print(f"Stored Courses: {StoredCourse.objects.count()}")
        print(f"Stored Sections: {StoredSection.objects.count()}")
        if StoredCourse.objects.exists():
            print(f"Last updated: {StoredCourse.objects.first().last_updated}")

    @classmethod
    def _ensure_data_loaded(cls):
        current_time = timezone.now()
        if cls._last_updated is None or (current_time - cls._last_updated).days >= 1:
            cls.load_courses()

    @classmethod
    def load_sections(cls):
        print("Loading sections...")
        sections = Section.objects.all()
        section_serializer = SectionSerializer(sections, many=True)
        cls._sections = section_serializer.data
        print(f"Loaded {len(cls._sections)} sections")

    @classmethod
    def reload_all_data(cls):
        cls.load_courses()
        cls.load_sections()
        cls._last_updated = timezone.now()
        print(f"All data reloaded at {cls._last_updated}")
