from django.apps import AppConfig


class CoursesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "courses"

    def ready(self):
        # from .course_storage import CourseStorage

        # CourseStorage.load_courses()
        pass
