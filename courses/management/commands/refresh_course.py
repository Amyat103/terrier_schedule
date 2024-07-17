from django.core.management.base import BaseCommand

from courses.course_store import CourseStore


class Command(BaseCommand):
    help = "Refreshes the course data in storage"

    def handle(self, *args, **options):
        CourseStore.load_courses()
        self.stdout.write(self.style.SUCCESS("Successfully refreshed course data"))
