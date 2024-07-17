from django.core.management.base import BaseCommand

from courses.models import Course, Section


class Command(BaseCommand):
    help = "Fetches and processes data daily from specific tables."

    def handle(self, *args, **options):
        self.stdout.write("Starting data fetch and process...")
        self.fetch_and_process()
        self.stdout.write("Data processing complete.")

    def fetch_and_process(self):
        courses = Course.objects.all()
        sections = Section.objects.all()

        for course in courses:
            print(f"{course.short_title}: {course.description}")
