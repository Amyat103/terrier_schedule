from django.core.management.base import BaseCommand

from courses.models import Course, Section


class Command(BaseCommand):
    help = "Check the contents of the local database"

    def handle(self, *args, **options):
        self.check_courses()
        self.check_sections()

    def check_courses(self):
        course_count = Course.objects.count()
        self.stdout.write(f"Number of courses in local database: {course_count}")

        if course_count > 0:
            sample_courses = Course.objects.all()[:5]
            self.stdout.write("Sample courses:")
            for course in sample_courses:
                self.stdout.write(
                    f"  - {course.major} {course.course_number}: {course.short_title}"
                )

    def check_sections(self):
        section_count = Section.objects.count()
        self.stdout.write(f"Number of sections in local database: {section_count}")

        if section_count > 0:
            sample_sections = Section.objects.all()[:5]
            self.stdout.write("Sample sections:")
            for section in sample_sections:
                self.stdout.write(
                    f"  - {section.course.short_title} - Section {section.class_section}"
                )
