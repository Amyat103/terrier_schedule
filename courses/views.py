from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from .course_storage import CourseStorage
from .models import Course, Section
from .serializer import CourseSerializer, SectionSerializer


# Create your views here.
class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def list(self, request, *args, **kwargs):
        print("CourseViewSet.list called")
        courses = CourseStorage.get_courses()
        serializer = CourseSerializer(courses, many=True)
        print(f"Returning {len(serializer.data)} courses from CourseViewSet")
        return Response(serializer.data, status=status.HTTP_200_OK)

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
        print("SectionViewSet.list called")
        sections = CourseStorage.get_sections()
        serializer = SectionSerializer(sections, many=True)
        print(f"Returning {len(serializer.data)} sections from SectionViewSet")
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

from django.http import JsonResponse

def debug_view(request):
    return JsonResponse({"message": "Debug view working"})