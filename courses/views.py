import json
import logging
import os

from django.conf import settings
from django.core.mail import send_mail
from django.core.management import call_command
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods, require_POST
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet

from config.auth_middleware import api_key_required

from .cache_utils import get_data_version as get_cached_version
from .cache_utils import update_cache_after_fetch
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
    logger.info("course_list view called")
    major_prefix = request.query_params.get("major_prefix")
    if major_prefix:
        courses = get_courses_by_major_prefix(major_prefix)
    else:
        courses = get_all_courses()
    return Response(courses)


@api_view(["GET"])
def section_list(request):
    logger.info("section_list view called")
    course_id = request.query_params.get("course_id")
    if course_id:
        sections = get_sections_by_course_id(course_id)
    else:
        sections = get_all_sections()
    return Response(sections)


@require_GET
def get_data_version(request):
    logger.info("get_data_version view called")
    version = get_cached_version()
    return JsonResponse({"version": version})


@csrf_exempt
@require_POST
def send_contact_email(request):
    try:
        data = json.loads(request.body)
        from_email = data.get("email")
        message = data.get("message")

        # track where message coming from
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")

        logger.info(f"Attempting to send email from {from_email}")
        logger.info(f"Email sent from {from_email} (IP: {ip})")

        full_message = f"From: {from_email}\nIP Address: {ip}\n\nMessage: {message}"

        send_mail(
            subject="New contact form submission",
            message=full_message,
            from_email=from_email,
            recipient_list=["amyat@bu.edu"],
            fail_silently=False,
        )

        return JsonResponse({"status": "success"})
    except Exception as e:
        logger.error(f"Error sending email from {from_email} (IP: {ip}): {str(e)}")
        return JsonResponse({"status": "error", "message": str(e)}, status=500)


def test_email(request):
    try:
        send_mail(
            "Test Email",
            "This is a test email from your Django application.",
            os.getenv("EMAIL_HOST_USER"),
            ["amyat@bu.edu"],
            fail_silently=False,
        )
        return HttpResponse("Test email sent successfully!")
    except Exception as e:
        return HttpResponse(f"Failed to send test email. Error: {str(e)}")


@csrf_exempt
@require_http_methods(["GET", "POST"])
def trigger_fetch_external_data(request):
    logger.info(f"Received {request.method} request for trigger_fetch_external_data")
    logger.info(f"Request headers: {request.headers}")
    logger.info(f"trigger_fetch_external_data: Received {request.method} request")
    logger.info(f"trigger_fetch_external_data: Headers: {request.headers}")
    try:
        call_command("fetch_external_data")
        update_cache_after_fetch()
        return JsonResponse(
            {"status": "success", "message": "Data fetch and cache update completed"}
        )
    except Exception as e:
        logger.error(f"Error in trigger_fetch_external_data: {str(e)}")
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
