import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0004_add_course_id_field"),
    ]

    operations = [
        # First remove the old foreign key
        migrations.RemoveField(
            model_name="section",
            name="course",
        ),
        # Then add it back with correct field type
        migrations.AddField(
            model_name="section",
            name="course",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="sections",
                to="courses.course",
                to_field="course_id",
            ),
        ),
    ]
