from django.core.management.base import BaseCommand
from django.db import connections

from courses.models import Course, Section


class Command(BaseCommand):
    help = "Mirrors data from online PostgreSQL database to local database"

    def handle(self, *args, **options):
        with connections["online"].cursor() as cursor:
            cursor.execute("SELECT * FROM courses")
            courses_columns = [col[0] for col in cursor.description]
            for row in cursor.fetchall():
                course_data = dict(zip(courses_columns, row))
                course_data_cleaned = {
                    k: (v if v is not None else None) for k, v in course_data.items()
                }
                Course.objects.update_or_create(
                    id=course_data_cleaned["id"], defaults=course_data_cleaned
                )

            cursor.execute("SELECT * FROM sections")
            sections_columns = [col[0] for col in cursor.description]
            for row in cursor.fetchall():
                section_data = dict(zip(sections_columns, row))
                section_data_cleaned = {
                    k: (v if v is not None else "") for k, v in section_data.items()
                }

                Section.objects.update_or_create(
                    id=section_data_cleaned["id"], defaults=section_data_cleaned
                )

        self.stdout.write(
            self.style.SUCCESS(
                "Successfully mirrored data from online to local database"
            )
        )
