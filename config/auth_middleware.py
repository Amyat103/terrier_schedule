from django.conf import settings
from django.http import JsonResponse


class APIAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith("/api/"):
            auth_token = request.headers.get("Authorization")
            if not auth_token or auth_token != f"Bearer {settings.API_SECRET_KEY}":
                return JsonResponse({"error": "Unauthorized"}, status=401)
        return self.get_response(request)
