from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from .course_storage import CourseStorage
from .models import Course, Section
from .serializer import CourseSerializer, SectionSerializer
from django.http import JsonResponse
import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response

logger = logging.getLogger(__name__)

# Create your views here.
class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def list(self, request, *args, **kwargs):
        logger.info("CourseViewSet.list called")
        try:
            courses = CourseStorage.get_courses()
            logger.info(f"Retrieved {len(courses)} courses from StoredCourse")
            for course in courses[:5]:
                logger.info(f"Sample course: {course}")
            serializer = self.get_serializer(courses, many=True)
            logger.info(f"Returning {len(serializer.data)} courses from CourseViewSet")
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in CourseViewSet.list: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_queryset(self):
        queryset = Course.objects.all()
        major = self.request.query_params.get("major", None)
        if major is not None:
            queryset = queryset.filter(major=major)
        return queryset


class SectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

    def list(self, request, *args, **kwargs):
        logger.info("SectionViewSet.list called")
        sections = self.get_queryset()
        serializer = self.get_serializer(sections, many=True)
        logger.info(f"Returning {len(serializer.data)} sections from SectionViewSet")
        return Response(serializer.data, status=status.HTTP_200_OK)


def course_schedule_view(request):
    courses = Course.objects.all()
    sections = Section.objects.all()

    context = {
        "courses": courses,
        "sections": sections,
    }
    print(f"Fetched {courses.count()} courses and {sections.count()} sections")
    return render(request, "courses/schedule.html", context)


def debug_view(request):
    return JsonResponse({"message": "Debug view working"})