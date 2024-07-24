import json
import logging

from django.conf import settings
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from .course_storage import CourseStorage
from .models import Course, Section
from .serializer import CourseSerializer, SectionSerializer

logger = logging.getLogger(__name__)


from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from .cache_utils import get_all_courses, get_all_sections


class CourseViewSet(ReadOnlyModelViewSet):
    serializer_class = CourseSerializer

    def get_queryset(self):
        return Course.objects.prefetch_related("sections")


class SectionViewSet(ReadOnlyModelViewSet):
    serializer_class = SectionSerializer

    def get_queryset(self):
        return Section.objects.select_related("course")


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


from .cache_utils import (
    get_all_courses,
    get_all_sections,
    get_courses_by_major_prefix,
    get_sections_by_course_id,
)


@api_view(["GET"])
def course_list(request):
    major_prefix = request.query_params.get("major_prefix")
    if major_prefix:
        courses = get_courses_by_major_prefix(major_prefix)
    else:
        courses = get_all_courses()
    return Response(courses)


@api_view(["GET"])
def section_list(request):
    course_id = request.query_params.get("course_id")
    if course_id:
        sections = get_sections_by_course_id(course_id)
    else:
        sections = get_all_sections()
    return Response(sections)


@require_GET
def get_data_version(request):
    version = timezone.now().strftime("%Y%m%d")
    return JsonResponse({"version": version})


@csrf_exempt
@require_POST
def send_contact_email(request):
    try:
        data = json.loads(request.body)
        from_email = data.get("email")
        message = data.get("message")

        send_mail(
            subject="New contact form submission",
            message=f"From: {from_email}\n\nMessage: {message}",
            from_email=from_email,
            recipient_list=["amyat@bu.edu"],
            fail_silently=False,
        )

        return JsonResponse({"status": "success"})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
