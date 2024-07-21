from rest_framework import serializers

from .models import Course, Section, StoredCourse, StoredSection


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = "__all__"


class SectionSerializer(serializers.ModelSerializer):
    course_id = serializers.UUIDField(read_only=True)
    major = serializers.SerializerMethodField()
    course_number = serializers.SerializerMethodField()
    short_title = serializers.SerializerMethodField()

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

    def get_major(self, obj):
        return obj.course.major if obj.course else None

    def get_course_number(self, obj):
        return obj.course.course_number if obj.course else None

    def get_short_title(self, obj):
        return obj.course.short_title if obj.course else None


class StoredCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredCourse
        fields = "__all__"


class StoredSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredSection
        fields = "__all__"
