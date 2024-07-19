# fetch_external_data.py
from django.core.management.base import BaseCommand
from django.db import connection, connections, transaction
from rest_framework import serializers
from courses.models import Course, Section, StoredCourse, StoredSection
from tqdm import tqdm
import logging
import uuid

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
        try:
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
        except Exception as e:
            self.stderr.write(f"Error fetching data: {str(e)}")
            return [], []

    def update_courses(self, courses):
        self.stdout.write('Updating courses...')
        new_courses = []
        for course_data in tqdm(courses, total=len(courses)):
            course = Course(
                course_id=uuid.uuid4(),
                id=course_data['id'],
                term=course_data.get('term'),
                major=course_data['major'],
                course_number=course_data['course_number'],
                short_title=course_data['short_title'],
                full_title=course_data['full_title'],
                description=course_data['description'],
                has_details=course_data['has_details'],
                is_registerable=course_data['is_registerable']
            )
            new_courses.append(course)
        
        with transaction.atomic():
            Course.objects.all().delete()
            Course.objects.bulk_create(new_courses, batch_size=1000)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {len(new_courses)} courses'))



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
        new_sections = []
        for section_data in tqdm(sections, total=len(sections)):
            try:
                course = Course.objects.get(id=section_data['course_id'])
                section = Section(
                    course=course,
                    class_section=section_data['class_section'],
                    class_type=section_data['class_type'],
                    professor_name=section_data['professor_name'],
                    class_capacity=section_data['class_capacity'],
                    enrollment_total=section_data['enrollment_total'],
                    enrollment_available=section_data['enrollment_available'],
                    days=section_data['days'],
                    start_time=section_data['start_time'],
                    end_time=section_data['end_time'],
                    location=section_data['location'],
                    is_active=section_data['is_active']
                )
                new_sections.append(section)
            except Course.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Course with id {section_data['course_id']} not found for section {section_data['class_section']}"))
        
        with transaction.atomic():
            Section.objects.all().delete()
            Section.objects.bulk_create(new_sections, batch_size=1000)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {len(new_sections)} sections'))


    def bulk_update_create(self, model, to_create, to_update):
        with transaction.atomic():
            if to_create:
                model.objects.bulk_create(to_create)
            if to_update:
                model.objects.bulk_update(to_update, ['data'])