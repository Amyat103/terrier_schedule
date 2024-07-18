# fetch_external_data.py
from django.core.management.base import BaseCommand
from django.db import connection, connections, transaction
from rest_framework import serializers
from courses.models import Course, Section, StoredCourse, StoredSection


from courses.models import Course, Section


class Command(BaseCommand):
    help = "Fetch and store data from external source"

    def handle(self, *args, **options):
        self.stdout.write('Fetching data...')
        courses, sections = self.fetch_external_data()
        
        self.update_courses(courses)
        self.update_sections(sections)
        
        self.stdout.write(self.style.SUCCESS('Data fetch and store completed'))

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
        existing_courses = {c.id: c for c in StoredCourse.objects.all()}
        to_create = []
        to_update = []
        
        for course in tqdm(courses, total=len(courses)):
            if course['id'] in existing_courses:
                stored_course = existing_courses[course['id']]
                stored_course.data = course
                to_update.append(stored_course)
            else:
                to_create.append(StoredCourse(course_id=course['id'], data=course))
            
            if len(to_create) + len(to_update) >= 1000:
                self.bulk_update_create(StoredCourse, to_create, to_update)
                to_create = []
                to_update = []
        
        if to_create or to_update:
            self.bulk_update_create(StoredCourse, to_create, to_update)

    def update_sections(self, sections):
        self.stdout.write('Updating sections...')
        existing_sections = {s.id: s for s in StoredSection.objects.all()}
        to_create = []
        to_update = []
        
        for section in tqdm(sections, total=len(sections)):
            if section['id'] in existing_sections:
                stored_section = existing_sections[section['id']]
                stored_section.data = section
                to_update.append(stored_section)
            else:
                to_create.append(StoredSection(section_id=section['id'], data=section))
            
            if len(to_create) + len(to_update) >= 1000:
                self.bulk_update_create(StoredSection, to_create, to_update)
                to_create = []
                to_update = []
        
        if to_create or to_update:
            self.bulk_update_create(StoredSection, to_create, to_update)

    def bulk_update_create(self, model, to_create, to_update):
        with transaction.atomic():
            if to_create:
                model.objects.bulk_create(to_create)
            if to_update:
                model.objects.bulk_update(to_update, ['data'])