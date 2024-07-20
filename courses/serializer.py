from rest_framework import serializers

from .models import Course, Section, StoredCourse, StoredSection


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"


class SectionSerializer(serializers.ModelSerializer):
    course_id = serializers.UUIDField(source="course.course_id", read_only=True)
    major = serializers.CharField(source="course.major", read_only=True)
    course_number = serializers.CharField(source="course.course_number", read_only=True)
    short_title = serializers.CharField(source="course.short_title", read_only=True)

    class Meta:
        model = Section
        fields = [
            "id",
            "course_id",
            "major",
            "course_number",
            "short_title",
            "class_section",
            "class_type",
            "professor_name",
            "class_capacity",
            "enrollment_total",
            "enrollment_available",
            "days",
            "start_time",
            "end_time",
            "location",
            "is_active",
        ]


class StoredCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredCourse
        fields = "__all__"


class StoredSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredSection
        fields = "__all__"
