# config/auth_middleware.py

import os
from functools import wraps

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


import logging

logger = logging.getLogger(__name__)


class APIAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith("/api/"):
            origin = request.headers.get("Origin", "")
            referer = request.headers.get("Referer", "")
            auth_token = request.headers.get("Authorization")

            logger.info(f"APIAuthMiddleware: Request method: {request.method}")
            logger.info(f"APIAuthMiddleware: Path: {request.path}")
            logger.info(f"APIAuthMiddleware: Content-Type: {request.content_type}")
            logger.info(f"APIAuthMiddleware: Origin: {origin}")
            logger.info(f"APIAuthMiddleware: Referer: {referer}")
            logger.info(f"APIAuthMiddleware: Auth Token: {auth_token}")

            is_allowed_origin = any(
                host in origin or host in referer
                for host in settings.CORS_ALLOWED_ORIGINS
            )

            if is_allowed_origin:
                logger.info(
                    f"Request allowed due to origin/referer: {origin or referer}"
                )
                return self.get_response(request)

            if auth_token and auth_token.startswith("Bearer "):
                api_key = auth_token.split(" ")[1]
                if api_key == settings.API_SECRET_KEY:
                    logger.info("Request allowed due to valid API key")
                    return self.get_response(request)

            logger.warning(
                f"Request forbidden: Invalid origin/referer ({origin or referer}) and no valid API key"
            )
            return JsonResponse({"error": "Unauthorized"}, status=401)

        return self.get_response(request)


def api_key_required(view_func):
    @wraps(view_func)
    def wrapped_view(request, *args, **kwargs):
        api_key = request.META.get("HTTP_X_API_KEY")
        if api_key == os.environ.get("API_SECRET_KEY"):
            return view_func(request, *args, **kwargs)
        return JsonResponse({"error": "Invalid API key"}, status=403)

    return wrapped_view
