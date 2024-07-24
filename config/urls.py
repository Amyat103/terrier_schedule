"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from courses.views import (
    CourseViewSet,
    SectionViewSet,
    course_schedule_view,
    debug_view,
    get_data_version,
    send_contact_email,
    test_email,
)

router = DefaultRouter()
router.register(r"courses", CourseViewSet, basename="course")
router.register(r"sections", SectionViewSet, basename="section")


def catch_all(request):
    return HttpResponse("Catch-all route hit", status=404)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("schedule/", course_schedule_view, name="course_schedule"),
    path("api/debug/", debug_view, name="debug_view"),
    path("", catch_all),
    path("api/data-version/", get_data_version, name="data_version"),
    path("api/send-contact-email/", send_contact_email, name="send_contact_email"),
    path("test-email/", test_email, name="test_email"),
]
