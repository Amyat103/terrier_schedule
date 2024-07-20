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
    queryset = Section.objects.all()
    serializer_class = SectionSerializer

    def list(self, request, *args, **kwargs):
        logger.info("SectionViewSet.list called")
        try:
            sections = CourseStorage.get_sections()
            logger.info(f"Retrieved {len(sections)} sections")
            serializer = self.get_serializer(sections, many=True)
            logger.info(
                f"Returning {len(serializer.data)} sections from SectionViewSet"
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error in SectionViewSet.list: {str(e)}")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get_queryset(self):
        return Section.objects.none()


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
