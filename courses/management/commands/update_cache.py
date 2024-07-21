from django.core.management.base import BaseCommand

from courses.cache_utils import update_cache_after_fetch


class Command(BaseCommand):
    help = "Updates the course and section cache"

    def handle(self, *args, **options):
        update_cache_after_fetch()
        self.stdout.write(self.style.SUCCESS("Successfully updated cache"))
