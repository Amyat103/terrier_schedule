from django.core.management.base import BaseCommand
from django.db import connection

from courses.models import Course, Section


class Command(BaseCommand):
    help = "Update local database from online PostgreSQL"

    def handle(self, *args, **options):
        self.stdout.write("Updating local database...")

        online_courses, online_sections = self.fetch_online_data()

        self.update_courses(online_courses)
        self.update_sections(online_sections)

        self.stdout.write(self.style.SUCCESS("Local database updated successfully"))

    def fetch_online_data(self):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM courses_course")
            columns = [col[0] for col in cursor.description]
            courses = [dict(zip(columns, row)) for row in cursor.fetchall()]
            self.stdout.write(f"Fetched {len(courses)} courses from online database")

            cursor.execute("SELECT * FROM courses_section")
            columns = [col[0] for col in cursor.description]
            sections = [dict(zip(columns, row)) for row in cursor.fetchall()]
            self.stdout.write(f"Fetched {len(sections)} sections from online database")

        return courses, sections

    def update_courses(self, online_courses):
        online_course_ids = set()
        for course_data in online_courses:
            course_id = course_data.pop("id")
            online_course_ids.add(course_id)
            Course.objects.update_or_create(id=course_id, defaults=course_data)

        Course.objects.exclude(id__in=online_course_ids).delete()

    def update_sections(self, online_sections):
        online_section_ids = set()
        for section_data in online_sections:
            section_id = section_data.pop("id")
            online_section_ids.add(section_id)
            Section.objects.update_or_create(id=section_id, defaults=section_data)

        Section.objects.exclude(id__in=online_section_ids).delete()
