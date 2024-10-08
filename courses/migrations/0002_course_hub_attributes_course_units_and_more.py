# Generated by Django 5.0.7 on 2024-07-31 08:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="course",
            name="hub_attributes",
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="course",
            name="units",
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name="section",
            name="professor_difficulty",
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="section",
            name="professor_link",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="section",
            name="professor_overall_quality",
            field=models.FloatField(blank=True, null=True),
        ),
    ]
