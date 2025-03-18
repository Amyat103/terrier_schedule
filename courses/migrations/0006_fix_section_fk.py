import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0004_add_course_id_field"),
    ]

    operations = [
        # Drop the foreign key constraint
        migrations.RunSQL(
            "ALTER TABLE courses_section DROP CONSTRAINT IF EXISTS courses_section_course_id_28d10451_fk_courses_course_id;"
        ),
        # Recreate the foreign key to point to course_id instead of id
        migrations.RunSQL(
            "ALTER TABLE courses_section ADD CONSTRAINT courses_section_course_id_fk FOREIGN KEY (course_id) REFERENCES courses_course(course_id);"
        ),
    ]
