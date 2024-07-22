import logging
from datetime import timedelta

from django.core.cache import cache
from django.db import connection

from .models import Course, Section
from .serializer import CourseSerializer, SectionSerializer

logger = logging.getLogger(__name__)

CACHE_DURATION = timedelta(days=8)
COURSES_CACHE_KEY = "all_courses_data"
SECTIONS_CACHE_KEY = "all_sections_data"
BATCH_SIZE = 500


def update_cache_after_fetch():
    logger.info("Starting cache update")
    try:
        update_courses_cache()
        update_sections_cache()
        logger.info("Cache update complete")
    except Exception as e:
        logger.error(f"Error during cache update: {str(e)}")
        raise


def update_courses_cache():
    logger.info("Updating courses cache")
    total_batches = (Course.objects.count() - 1) // BATCH_SIZE + 1

    for i in range(total_batches):
        logger.info(f"Processing courses batch {i + 1}/{total_batches}")
        courses_batch = Course.objects.all()[i * BATCH_SIZE : (i + 1) * BATCH_SIZE]
        serialized_batch = CourseSerializer(courses_batch, many=True).data
        cache.set(
            f"{COURSES_CACHE_KEY}_{i}",
            serialized_batch,
            timeout=CACHE_DURATION.total_seconds(),
        )

    cache.set(
        f"{COURSES_CACHE_KEY}_total_batches",
        total_batches,
        timeout=CACHE_DURATION.total_seconds(),
    )


def get_all_courses():
    total_batches = cache.get(f"{COURSES_CACHE_KEY}_total_batches")
    if total_batches is None:
        logger.info("Cache miss: Fetching courses from database")
        return None

    all_courses = []
    for i in range(total_batches):
        batch = cache.get(f"{COURSES_CACHE_KEY}_{i}")
        if batch is None:
            logger.info(f"Cache miss: Batch {i} not found in cache")
            return None
        all_courses.extend(batch)

    logger.info("Cache hit: Retrieved all courses from cache")
    return all_courses


def update_sections_cache():
    logger.info("Updating sections cache")
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM courses_section")
        total_sections = cursor.fetchone()[0]
    logger.info(f"Total sections to process: {total_sections}")

    for i in range(0, total_sections, BATCH_SIZE):
        start = i
        end = min(i + BATCH_SIZE, total_sections)
        logger.info(f"Processing sections batch {start+1}-{end} of {total_sections}")
        sections_batch = Section.objects.select_related("course").all()[start:end]
        logger.info(f"Fetched {len(sections_batch)} sections from database")
        logger.info("Starting serialization")
        serialized_batch = SectionSerializer(sections_batch, many=True).data
        logger.info(f"Serialized {len(serialized_batch)} sections")
        logger.info("Storing batch in cache")
        cache.set(
            f"{SECTIONS_CACHE_KEY}_{i//BATCH_SIZE}",
            serialized_batch,
            timeout=CACHE_DURATION.total_seconds(),
        )
        logger.info(f"Stored batch {i//BATCH_SIZE} in cache")

    logger.info(f"Finished processing all {total_sections} sections")
    cache.set(
        f"{SECTIONS_CACHE_KEY}_total_batches",
        (total_sections - 1) // BATCH_SIZE + 1,
        timeout=CACHE_DURATION.total_seconds(),
    )
    logger.info("Updated total batches in cache")


# def get_all_courses():
#     courses = cache.get(COURSES_CACHE_KEY)
#     if not courses:
#         all_courses = Course.objects.all()
#         courses = CourseSerializer(all_courses, many=True).data
#         cache.set(COURSES_CACHE_KEY, courses, timeout=CACHE_DURATION.total_seconds())
#     return courses


def get_all_sections():
    total_batches = cache.get(f"{SECTIONS_CACHE_KEY}_total_batches")
    if total_batches is None:
        logger.info("Cache miss: Fetching sections from database")
        return None

    all_sections = []
    for i in range(total_batches):
        batch = cache.get(f"{SECTIONS_CACHE_KEY}_{i}")
        if batch is None:
            logger.info(f"Cache miss: Batch {i} not found in cache")
            return None
        all_sections.extend(batch)

    logger.info("Cache hit: Retrieved all sections from cache")
    return all_sections


def get_courses_by_major_prefix(major_prefix):
    all_courses = get_all_courses()
    return [
        course for course in all_courses if course["major"].startswith(major_prefix)
    ]


def get_sections_by_course_id(course_id):
    all_sections = get_all_sections()
    return [section for section in all_sections if section["course_id"] == course_id]
