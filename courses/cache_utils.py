from datetime import timedelta

from django.core.cache import cache

from .models import Course, Section
from .serializer import CourseSerializer, SectionSerializer

CACHE_DURATION = timedelta(days=8)
COURSES_CACHE_KEY = "all_courses_data"
SECTIONS_CACHE_KEY = "all_sections_data"


def update_cache_after_fetch():
    all_courses = Course.objects.all()
    all_sections = Section.objects.all()

    courses_data = CourseSerializer(all_courses, many=True).data
    sections_data = SectionSerializer(all_sections, many=True).data

    cache.set(COURSES_CACHE_KEY, courses_data, timeout=CACHE_DURATION.total_seconds())
    cache.set(SECTIONS_CACHE_KEY, sections_data, timeout=CACHE_DURATION.total_seconds())


def get_all_courses():
    courses = cache.get(COURSES_CACHE_KEY)
    if not courses:
        all_courses = Course.objects.all()
        courses = CourseSerializer(all_courses, many=True).data
        cache.set(COURSES_CACHE_KEY, courses, timeout=CACHE_DURATION.total_seconds())
    return courses


def get_all_sections():
    sections = cache.get(SECTIONS_CACHE_KEY)
    if not sections:
        all_sections = Section.objects.all()
        sections = SectionSerializer(all_sections, many=True).data
        cache.set(SECTIONS_CACHE_KEY, sections, timeout=CACHE_DURATION.total_seconds())
    return sections


def get_courses_by_major_prefix(major_prefix):
    all_courses = get_all_courses()
    return [
        course for course in all_courses if course["major"].startswith(major_prefix)
    ]


def get_sections_by_course_id(course_id):
    all_sections = get_all_sections()
    return [section for section in all_sections if section["course_id"] == course_id]
