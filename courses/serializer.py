from rest_framework import serializers

from .models import Course, Section, StoredCourse, StoredSection


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = "__all__"


class StoredCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredCourse
        fields = "__all__"


class StoredSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredSection
        fields = "__all__"
