import uuid

from django.db import models


class Course(models.Model):
    course_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    id = models.AutoField(primary_key=True)
    term = models.CharField(max_length=20, null=True, blank=True)
    major = models.CharField(max_length=50)
    course_number = models.CharField(max_length=10)
    short_title = models.CharField(max_length=50)
    full_title = models.CharField(max_length=100)
    description = models.TextField()
    has_details = models.BooleanField(default=False)
    is_registerable = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)
    hub_attributes = models.JSONField(null=True, blank=True)
    units = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return f"{self.major} {self.course_number}: {self.short_title}"


class Section(models.Model):
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="sections", to_field="course_id"
    )
    class_section = models.CharField(max_length=10)
    class_type = models.CharField(max_length=10)
    professor_name = models.CharField(max_length=100)
    class_capacity = models.IntegerField()
    enrollment_total = models.IntegerField()
    enrollment_available = models.IntegerField()
    days = models.CharField(max_length=50)
    start_time = models.CharField(max_length=50, null=True, blank=True)
    end_time = models.CharField(max_length=50, null=True, blank=True)
    location = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    professor_overall_quality = models.FloatField(null=True, blank=True)
    professor_difficulty = models.FloatField(null=True, blank=True)
    professor_link = models.CharField(max_length=255, null=True, blank=True)
    last_rmp_update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.course.short_title} - Section {self.class_section}"


class StoredCourse(models.Model):
    course_id = models.UUIDField(unique=True)
    data = models.JSONField()
    last_updated = models.DateTimeField(auto_now=True)


class StoredSection(models.Model):
    section_id = models.IntegerField(unique=True)
    data = models.JSONField()
    last_updated = models.DateTimeField(auto_now=True)
