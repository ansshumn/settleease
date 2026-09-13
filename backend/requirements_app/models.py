from django.db import models
from django.conf import settings

class Requirement(models.Model):
    # 'settings.AUTH_USER_MODEL' ka matlab hai ki yeh requirement kis user ne post ki hai
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    # Requirement ki details
    title = models.CharField(max_length=200, blank=True)  # e.g. "Internet in Ahmedabad"
    category = models.CharField(max_length=100, blank=True)  # e.g. "internet", "pg"
    type = models.CharField(max_length=100, blank=True)  # legacy field
    area = models.CharField(max_length=100)
    budget = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    timeline = models.CharField(max_length=100, blank=True)  # e.g. "Immediate", "Within 1 week"
    
    # Status (open = abhi zarurat hai, closed = mil gaya)
    status = models.CharField(max_length=20, default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title or self.type} in {self.area} - {self.status}"


class RequirementResponse(models.Model):
    requirement = models.ForeignKey(Requirement, related_name='responses', on_delete=models.CASCADE)
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    provider_name = models.CharField(max_length=200, blank=True)
    provider_phone = models.CharField(max_length=50, blank=True)
    provider_service_name = models.CharField(max_length=200, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response by {self.provider_name or self.provider.email} for {self.requirement.id}"
