from django.core.management.base import BaseCommand
from django.db import transaction

from courses.models import Course, Section, StoredCourse, StoredSection
from courses.serializer import CourseSerializer, SectionSerializer


class Command(BaseCommand):
    help = "Update stored course and section data"

    def handle(self, *args, **options):
        self.update_courses()
        self.update_sections()
        self.stdout.write(self.style.SUCCESS("Successfully updated stored data"))

    def update_courses(self):
        courses = Course.objects.all()
        course_data = CourseSerializer(courses, many=True).data

        with transaction.atomic():
            StoredCourse.objects.all().delete()
            for course in course_data:
                StoredCourse.objects.create(course_id=course["id"], data=course)

    def update_sections(self):
        sections = Section.objects.all()
        section_data = SectionSerializer(sections, many=True).data

        with transaction.atomic():
            StoredSection.objects.all().delete()
            for section in section_data:
                StoredSection.objects.create(section_id=section["id"], data=section)
