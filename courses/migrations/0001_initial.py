# Generated by Django 5.0.7 on 2024-07-16 20:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Course",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("term", models.CharField(blank=True, max_length=20, null=True)),
                ("major", models.CharField(max_length=50)),
                ("course_number", models.CharField(max_length=10)),
                ("short_title", models.CharField(max_length=50)),
                ("full_title", models.CharField(max_length=100)),
                ("description", models.TextField()),
                ("has_details", models.BooleanField(default=False)),
                ("is_registerable", models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name="Section",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("class_section", models.CharField(max_length=10)),
                ("class_type", models.CharField(max_length=10)),
                ("professor_name", models.CharField(max_length=100)),
                ("class_capacity", models.IntegerField()),
                ("enrollment_total", models.IntegerField()),
                ("enrollment_available", models.IntegerField()),
                ("days", models.CharField(max_length=50)),
                ("start_time", models.CharField(max_length=50)),
                ("end_time", models.CharField(max_length=50)),
                ("location", models.CharField(max_length=255)),
                ("is_active", models.BooleanField(default=True)),
                (
                    "course",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="sections",
                        to="courses.course",
                    ),
                ),
            ],
        ),
    ]