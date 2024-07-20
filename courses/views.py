import logging

from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from .course_storage import CourseStorage
from .models import Course, Section
from .serializer import CourseSerializer, SectionSerializer

logger = logging.getLogger(__name__)


class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def list(self, request, *args, **kwargs):
        logger.info("CourseViewSet.list called")
        try:
            courses = CourseStorage.get_courses()
            logger.info(f"Retrieved {len(courses)} courses")
            serializer = self.get_serializer(courses, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in CourseViewSet.list: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class SectionViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SectionSerializer

    def get_queryset(self):
        return CourseStorage.get_sections()

    def list(self, request, *args, **kwargs):
        logger.info("SectionViewSet.list called")
        queryset = self.get_queryset()
        logger.info(f"Retrieved {len(queryset)} sections")
        return Response(queryset, status=status.HTTP_200_OK)


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
