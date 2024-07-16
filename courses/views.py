from django.shortcuts import render
from rest_framework import viewsets

from .models import Course, Section
from .serializer import CourseSerializer, SectionSerializer


# Create your views here.
class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_queryset(self):
        queryset = Course.objects.all()
        major = self.requests.query_params.get("major", None)
        if major is not None:
            queryset = queryset.filter(major=major)
        return queryset


class SectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
