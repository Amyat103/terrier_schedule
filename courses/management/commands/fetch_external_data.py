# fetch_external_data.py
from django.core.management.base import BaseCommand
from django.db import connection, connections, transaction
from rest_framework import serializers

from courses.models import Course, Section


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

    def update_courses(self, courses_data):
        self.stdout.write("Updating courses...")
        existing_courses = {c.id: c for c in Course.objects.all()}
        to_create = []
        to_update = []

        for i, course_data in enumerate(courses_data, 1):
            if course_data["id"] in existing_courses:
                course = existing_courses[course_data["id"]]
                for key, value in course_data.items():
                    if key != "id":  # Skip the primary key
                        setattr(course, key, value)
                to_update.append(course)
            else:
                to_create.append(Course(**course_data))

            if i % 1000 == 0:
                self.stdout.write(f"Processed {i}/{len(courses_data)} courses")

        Course.objects.bulk_create(to_create)
        if to_update:
            update_fields = [f for f in courses_data[0].keys() if f != "id"]
            Course.objects.bulk_update(to_update, fields=update_fields)
        self.stdout.write(
            self.style.SUCCESS(
                f"Created {len(to_create)} and updated {len(to_update)} courses"
            )
        )

    def update_sections(self, sections_data):
        self.stdout.write("Updating sections...")
        existing_sections = {s.id: s for s in Section.objects.all()}
        to_create = []
        to_update = []

        for i, section_data in enumerate(sections_data, 1):
            if section_data["id"] in existing_sections:
                section = existing_sections[section_data["id"]]
                for key, value in section_data.items():
                    if key != "id":  # Skip the primary key
                        setattr(section, key, value)
                to_update.append(section)
            else:
                to_create.append(Section(**section_data))

            if i % 1000 == 0:
                self.stdout.write(f"Processed {i}/{len(sections_data)} sections")

        Section.objects.bulk_create(to_create)
        if to_update:
            update_fields = [f for f in sections_data[0].keys() if f != "id"]
            Section.objects.bulk_update(to_update, fields=update_fields)
        self.stdout.write(
            self.style.SUCCESS(
                f"Created {len(to_create)} and updated {len(to_update)} sections"
            )
        )
