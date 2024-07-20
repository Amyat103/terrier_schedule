# fetch_external_data.py
import logging
import uuid

from django.core.management.base import BaseCommand
from django.db import connection, connections, transaction
from rest_framework import serializers
from tqdm import tqdm

from courses.models import Course, Section, StoredCourse, StoredSection

logger = logging.getLogger(__name__)


from courses.models import Course, Section


class Command(BaseCommand):
    help = "Fetch and store data from external source"

    def handle(self, *args, **options):
        print("Fetching data...")
        courses, sections = self.fetch_external_data()

        id_to_uuid = self.update_courses(courses)
        self.update_sections(sections, id_to_uuid)

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
        id_to_uuid = {}  # New dictionary to map integer IDs to UUIDs
        for course in tqdm(courses, total=len(courses)):
            course_id = course.pop("id")
            uuid_id = uuid.uuid4()  # Generate a new UUID
            id_to_uuid[course_id] = uuid_id  # Store the mapping
            stored_courses.append(StoredCourse(course_id=uuid_id, data=course))

        with transaction.atomic():
            StoredCourse.objects.all().delete()
            StoredCourse.objects.bulk_create(stored_courses, batch_size=1000)

        self.stdout.write(f"Successfully updated {len(stored_courses)} courses")
        return id_to_uuid

    def update_sections(self, sections, id_to_uuid):
        self.stdout.write("Updating sections...")
        stored_sections = []
        skipped_sections = 0

        for section in tqdm(sections, total=len(sections)):
            section_id = section.pop("id")
            course_id = section.get("course_id")

            if course_id in id_to_uuid:
                section["course_id"] = str(
                    id_to_uuid[course_id]
                )  # Convert to UUID string
                stored_sections.append(
                    StoredSection(section_id=section_id, data=section)
                )
            else:
                skipped_sections += 1
                if skipped_sections <= 5:
                    self.stdout.write(f"Skipped section: {section}")

        with transaction.atomic():
            StoredSection.objects.all().delete()
            StoredSection.objects.bulk_create(stored_sections, batch_size=1000)

        self.stdout.write(f"Successfully updated {len(stored_sections)} sections")
        self.stdout.write(f"Skipped {skipped_sections} sections due to missing courses")

    def bulk_update_create(self, model, to_create, to_update):
        with transaction.atomic():
            if to_create:
                model.objects.bulk_create(to_create)
            if to_update:
                model.objects.bulk_update(to_update, ["data"])
