from django.db import models


# Create your models here.
class Course(models.Model):
    term = models.CharField(max_length=20, null=True, blank=True)
    major = models.CharField(max_length=50)
    course_number = models.CharField(max_length=10)
    short_title = models.CharField(max_length=50)
    full_title = models.CharField(max_length=100)
    description = models.TextField()
    has_details = models.BooleanField(default=False)
    is_registerable = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.major} {self.course_number}: {self.short_title}"


class Section(models.Model):
    course = models.ForeignKey(
        Course, related_name="sections", on_delete=models.CASCADE
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

    def __str__(self):
        return f"{self.course.short_title} - Section {self.class_section}"


class StoredCourse(models.Model):
    course_id = models.IntegerField(unique=True)
    data = models.JSONField()
    last_updated = models.DateTimeField(auto_now=True)


class StoredSection(models.Model):
    section_id = models.IntegerField(unique=True)
    data = models.JSONField()
    last_updated = models.DateTimeField(auto_now=True)
