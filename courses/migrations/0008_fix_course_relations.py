import uuid

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("courses", "0007_merge_0005_fix_section_course_id_0006_fix_section_fk"),
    ]

    operations = [
        # Clear all data
        migrations.RunSQL("TRUNCATE courses_section CASCADE;"),
        # Remove the current foreign key
        migrations.RunSQL(
            "ALTER TABLE courses_section DROP CONSTRAINT IF EXISTS courses_section_course_id_28d10451_fk_courses_course_id;"
        ),
        # Change the column type in sections
        migrations.RunSQL(
            "ALTER TABLE courses_section DROP COLUMN IF EXISTS course_id;"
        ),
        # Add new column with correct type
        migrations.RunSQL(
            "ALTER TABLE courses_section ADD COLUMN course_id uuid REFERENCES courses_course(course_id);"
        ),
    ]
