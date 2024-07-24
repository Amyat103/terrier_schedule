# config/auth_middleware.py

from django.conf import settings
from django.http import JsonResponse

ALLOWED_HOSTS = [
    "terrier-schedule.dev",
    "www.terrier-schedule.dev",
    "terrier-schedule.up.railway.app",
    "https://terrier-schedule.dev/",
    "https://web-production-08125.up.railway.app/",
    "https://web-production-08125.up.railway.app/api/",
    "https://www.terrier-schedule.dev/",
    "https://terrier-schedule.up.railway.app/",
]


class APIAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith("/api/"):
            origin = request.headers.get("Origin", "")
            referer = request.headers.get("Referer", "")

            is_allowed_origin = any(
                host in origin or host in referer for host in ALLOWED_HOSTS
            )

            if not is_allowed_origin:
                auth_token = request.headers.get("Authorization")
                if not auth_token or auth_token != f"Bearer {settings.API_SECRET_KEY}":
                    return JsonResponse({"error": "Unauthorized"}, status=401)

        return self.get_response(request)
