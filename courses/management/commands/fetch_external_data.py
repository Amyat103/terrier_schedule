import logging
import uuid

from django.core.management.base import BaseCommand
from django.db import connection, connections, transaction
from rest_framework import serializers
from tqdm import tqdm

from courses.cache_utils import update_cache_after_fetch
from courses.models import Course, Section, StoredCourse, StoredSection

logger = logging.getLogger(__name__)


from courses.models import Course, Section


class Command(BaseCommand):
    help = "Fetch and store data from external source"

    def handle(self, *args, **options):
        print("Fetching data...")
        courses, sections = self.fetch_external_data()

        stored_courses, id_to_uuid = self.update_courses(courses)
        self.update_sections(sections, stored_courses, id_to_uuid)

        self.stdout.write("Updating cache...")
        update_cache_after_fetch()
        self.stdout.write(
            self.style.SUCCESS(
                "Finished data fetching (from scraper) and updated cache successfully"
            )
        )

    def fetch_external_data(self):
        with connections["online"].cursor() as cursor:
            cursor.execute("SELECT * FROM courses")
            columns = [col[0] for col in cursor.description]
            courses = [dict(zip(columns, row)) for row in cursor.fetchall()]
            self.stdout.write(f"Fetched {len(courses)} courses from online database")
            self.stdout.write(
                f"Sample course: {courses[0] if courses else 'No courses'}"
            )

            cursor.execute("SELECT * FROM sections")
            columns = [col[0] for col in cursor.description]
            sections = [dict(zip(columns, row)) for row in cursor.fetchall()]
            self.stdout.write(f"Fetched {len(sections)} sections from online database")
            self.stdout.write(
                f"Sample section: {sections[0] if sections else 'No sections'}"
            )

        return courses, sections

    def update_courses(self, courses):
        self.stdout.write("Updating courses...")
        stored_courses = []
        course_objects = []
        id_to_uuid = {}
        for course in tqdm(courses, total=len(courses)):
            course_id = course.pop("id")
            course.pop("updated_at", None)
            uuid_id = uuid.uuid4()
            id_to_uuid[course_id] = uuid_id
            stored_course = StoredCourse(course_id=uuid_id, data=course)
            stored_courses.append(stored_course)
            course_objects.append(Course(course_id=uuid_id, **course))

        with transaction.atomic():
            StoredCourse.objects.all().delete()
            Course.objects.all().delete()
            StoredCourse.objects.bulk_create(stored_courses, batch_size=1000)
            Course.objects.bulk_create(course_objects, batch_size=1000)

        self.stdout.write(f"Successfully updated {len(stored_courses)} courses")
        return course_objects, id_to_uuid

    def update_sections(self, sections, course_objects, id_to_uuid):
        self.stdout.write("Updating sections...")
        new_sections = []
        skipped_sections = 0
        course_dict = {str(course.course_id): course for course in course_objects}

        for section in tqdm(sections, total=len(sections)):
            course_id = section.get("course_id")
            if course_id in id_to_uuid:
                uuid_course_id = str(id_to_uuid[course_id])
                course = course_dict.get(uuid_course_id)
                if course:
                    new_section = Section(
                        course=course,
                        class_section=section["class_section"],
                        class_type=section["class_type"],
                        professor_name=section["professor_name"],
                        class_capacity=section["class_capacity"],
                        enrollment_total=section["enrollment_total"],
                        enrollment_available=section["enrollment_available"],
                        days=section["days"],
                        start_time=section["start_time"],
                        end_time=section["end_time"],
                        location=section["location"],
                        is_active=section["is_active"],
                    )
                    new_sections.append(new_section)
                else:
                    skipped_sections += 1
            else:
                skipped_sections += 1

        with transaction.atomic():
            Section.objects.all().delete()
            Section.objects.bulk_create(new_sections, batch_size=1000)

        self.stdout.write(f"Successfully updated {len(new_sections)} sections")
        self.stdout.write(f"Skipped {skipped_sections} sections due to missing courses")

    def bulk_update_create(self, model, to_create, to_update):
        with transaction.atomic():
            if to_create:
                model.objects.bulk_create(to_create)
            if to_update:
                model.objects.bulk_update(to_update, ["data"])
