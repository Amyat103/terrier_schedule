from django.http import HttpResponseForbidden

ALLOWED_REFERERS = [
    "https://terrier-schedule.dev",
    "https://www.terrier-schedule.dev",
    "https://terrier-schedule.up.railway.app",
    "https://web-production-08125.up.railway.app/",
]


class RefererCheckMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        referer = request.META.get("HTTP_REFERER")

        if not referer:
            return self.get_response(request)

        if not any(allowed in referer for allowed in ALLOWED_REFERERS):
            return HttpResponseForbidden("Access not allowed from this origin")

        return self.get_response(request)
