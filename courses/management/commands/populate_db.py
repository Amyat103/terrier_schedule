from django.core.management.base import BaseCommand

from courses.models import Course, Section


class Command(BaseCommand):
    help = "Populate the database with sample courses and sections"

    def handle(self, *args, **options):
        courses_data = [
            {
                "major": "CS",
                "course_number": "101",
                "short_title": "Intro CS",
                "full_title": "Introduction to Computer Science",
            },
            {
                "major": "MATH",
                "course_number": "201",
                "short_title": "Calculus I",
                "full_title": "Calculus I",
            },
            {
                "major": "PHYS",
                "course_number": "301",
                "short_title": "Mechanics",
                "full_title": "Classical Mechanics",
            },
        ]

        for course_data in courses_data:
            course, created = Course.objects.get_or_create(
                major=course_data["major"],
                course_number=course_data["course_number"],
                defaults={
                    "short_title": course_data["short_title"],
                    "full_title": course_data["full_title"],
                    "description": f"Description for {course_data['full_title']}",
                    "has_details": True,
                    "is_registerable": True,
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created course: {course}"))
            else:
                self.stdout.write(f"Course already exists: {course}")

            section, created = Section.objects.get_or_create(
                course=course,
                class_section="A1",
                defaults={
                    "class_type": "LEC",
                    "professor_name": f"Dr. {course_data['major']}",
                    "class_capacity": 30,
                    "enrollment_total": 25,
                    "enrollment_available": 5,
                    "days": "MWF",
                    "start_time": "09:00",
                    "end_time": "10:00",
                    "location": f"Room {course_data['course_number']}",
                    "is_active": True,
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created section: {section}"))
            else:
                self.stdout.write(f"Section already exists: {section}")

        self.stdout.write(self.style.SUCCESS("Database population completed"))
