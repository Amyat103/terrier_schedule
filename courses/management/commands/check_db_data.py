from django.core.management.base import BaseCommand
from django.db import connection


class Command(BaseCommand):
    help = "Check data in the database"

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM courses_course")
            course_count = cursor.fetchone()[0]
            self.stdout.write(f"Number of courses in database: {course_count}")

            cursor.execute("SELECT COUNT(*) FROM courses_section")
            section_count = cursor.fetchone()[0]
            self.stdout.write(f"Number of sections in database: {section_count}")

            if course_count > 0:
                cursor.execute("SELECT * FROM courses_course LIMIT 5")
                columns = [col[0] for col in cursor.description]
                courses = [dict(zip(columns, row)) for row in cursor.fetchall()]
                self.stdout.write("Sample courses:")
                for course in courses:
                    self.stdout.write(str(course))

            if section_count > 0:
                cursor.execute("SELECT * FROM courses_section LIMIT 5")
                columns = [col[0] for col in cursor.description]
                sections = [dict(zip(columns, row)) for row in cursor.fetchall()]
                self.stdout.write("Sample sections:")
                for section in sections:
                    self.stdout.write(str(section))
