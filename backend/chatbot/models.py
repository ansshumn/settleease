from django.db import models
from django.conf import settings

class ChatMessage(models.Model):
    SENDER_CHOICES = [
        ('user', 'User'),
        ('bot', 'Bot'),
    ]
    # null=True aur blank=True isliye taaki bina login kiye (anonymous) chat ki ja sake
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    message = models.TextField()
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender}: {self.message[:30]}..."

