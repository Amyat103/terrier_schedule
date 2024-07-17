# fetch_external_data.py

import requests
from django.core.management.base import BaseCommand
from django.db import connection, connections, transaction
from django.db.models import Case, When
from rest_framework import serializers
from serializer import CourseSerializer, SectionSerializer

from courses.models import Course, Section
from courses.serializer import CourseSerializer, SectionSerializer


class Command(BaseCommand):
    help = "Fetch and store data from external source"

    def handle(self, *args, **options):
        try:
            courses_data, sections_data = self.fetch_external_data()
            with transaction.atomic():
                self.update_courses(courses_data)
                self.update_sections(sections_data)
                self.stdout.write(
                    self.style.SUCCESS("All updates committed to database")
                )
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {e}"))
            raise

    def fetch_external_data(self):
        with connections["online"].cursor() as cursor:
            cursor.execute("SELECT * FROM courses")
            columns = [col[0] for col in cursor.description]
            courses = [dict(zip(columns, row)) for row in cursor.fetchall()]
            self.stdout.write(f"Fetched {len(courses)} courses from online database")

            cursor.execute("SELECT * FROM sections")
            columns = [col[0] for col in cursor.description]
            sections = [dict(zip(columns, row)) for row in cursor.fetchall()]
            self.stdout.write(f"Fetched {len(sections)} sections from online database")

        return courses, sections

    def fetch_and_store_data(self):
        with connection.cursor() as cursor:
            try:
                cursor.execute("SELECT * FROM courses_course")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Failed to execute query: {e}"))
                raise

    def update_courses(self, courses_data):
        for course_data in courses_data:
            Course.objects.update_or_create(id=course_data["id"], defaults=course_data)
        course_ids = [data["id"] for data in courses_data]
        courses = Course.objects.filter(id__in=course_ids)

        courses_dict = {course.id: course for course in courses}
        updated_courses = []
        for data in courses_data:
            course = courses_dict.get(data["id"])
            if course:
                course.field1 = data["field1"]
                course.field2 = data["field2"]
                updated_courses.append(course)

        Course.objects.bulk_update(updated_courses, ["field1", "field2"])
