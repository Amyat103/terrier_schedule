# fetch_external_data.py
from django.core.management.base import BaseCommand
from django.db import connection, connections, transaction
from rest_framework import serializers
from courses.models import Course, Section, StoredCourse, StoredSection
from tqdm import tqdm
import logging

logger = logging.getLogger(__name__)



from courses.models import Course, Section


class Command(BaseCommand):
    help = "Fetch and store data from external source"

    def handle(self, *args, **options):
        print('Fetching data...')
        courses, sections = self.fetch_external_data()
        
        self.update_courses(courses)
        self.update_sections(sections)

    def fetch_external_data(self):
        with connections["online"].cursor() as cursor:
            cursor.execute("SELECT * FROM courses")
            columns = [col[0] for col in cursor.description]
            courses = [dict(zip(columns, row)) for row in cursor.fetchall()]
            self.stdout.write(f"Fetched {len(courses)} courses from online database")

            cursor.execute("SELECT * FROM sections")
            columns = [col[0] for col in cursor.description]
            sections = [dict(zip(columns, row)) for row in cursor.fetchall()]
            self.stdout.write(f"Fetched {len(sections)} sections from online database")

        return courses, sections

    def update_courses(self, courses):
        self.stdout.write('Updating courses...')
        stored_courses = []
        for course in tqdm(courses, total=len(courses)):
            course_id = course.pop('id')
            stored_courses.append(StoredCourse(course_id=course_id, data=course))
        
        with transaction.atomic():
            StoredCourse.objects.all().delete()
            StoredCourse.objects.bulk_create(stored_courses, batch_size=1000)


    # old update course function
    # def update_courses(self, courses):
    #     self.stdout.write('Updating courses...')
    #     existing_courses = {c.id: c for c in StoredCourse.objects.all()}
    #     to_create = []
    #     to_update = []
        
    #     for course in tqdm(courses, total=len(courses)):
    #         if course['id'] in existing_courses:
    #             stored_course = existing_courses[course['id']]
    #             stored_course.data = course
    #             to_update.append(stored_course)
    #         else:
    #             to_create.append(StoredCourse(course_id=course['id'], data=course))
            
    #         if len(to_create) + len(to_update) >= 1000:
    #             self.bulk_update_create(StoredCourse, to_create, to_update)
    #             to_create = []
    #             to_update = []
        
    #     if to_create or to_update:
    #         self.bulk_update_create(StoredCourse, to_create, to_update)

    def update_sections(self, sections):
        self.stdout.write('Updating sections...')
        stored_sections = []
        for section in tqdm(sections, total=len(sections)):
            section_id = section.pop('id')
            stored_sections.append(StoredSection(section_id=section_id, data=section))
        
        with transaction.atomic():
            StoredSection.objects.all().delete()
            StoredSection.objects.bulk_create(stored_sections, batch_size=1000)


    def bulk_update_create(self, model, to_create, to_update):
        with transaction.atomic():
            if to_create:
                model.objects.bulk_create(to_create)
            if to_update:
                model.objects.bulk_update(to_update, ['data'])