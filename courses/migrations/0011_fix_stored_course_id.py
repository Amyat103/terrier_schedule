from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0010_merge_0008_fix_course_relations_0009_fix_schema_final"),
    ]

    operations = [
        # StoredCourse course_id field modified manually to UUID type
    ]
