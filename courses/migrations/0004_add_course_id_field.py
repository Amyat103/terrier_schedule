import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0003_course_updated_at_section_last_rmp_update"),
    ]

    operations = [
        migrations.AddField(
            model_name="course",
            name="course_id",
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
            preserve_default=False,
        ),
    ]
