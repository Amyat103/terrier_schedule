import logging
import os

from django.core.cache import cache
from django.core.management.base import BaseCommand

from courses.cache_utils import update_cache_after_fetch

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = "Updates the course and section cache"

    def handle(self, *args, **options):
        try:
            self.stdout.write(f"REDIS_URL: {os.environ.get('REDIS_URL', 'Not set')}")

            cache.set("test_key", "test_value", 10)
            result = cache.get("test_key")
            if result != "test_value":
                raise Exception("Redis test failed")

            self.stdout.write("Redis connection test passed")

            update_cache_after_fetch()
            self.stdout.write(self.style.SUCCESS("Successfully updated cache"))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to update cache: {str(e)}"))
