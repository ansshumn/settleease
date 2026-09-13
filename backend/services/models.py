from django.db import models
from django.conf import settings

class Service(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    PRICE_TYPE_CHOICES = [
        ('monthly', 'Monthly'), 
        ('daily', 'Daily'), 
        ('per_visit', 'Per Visit')
    ]
    CATEGORY_CHOICES = [
        ('pg', 'PG / Hostel'), 
        ('tiffin', 'Tiffin Service'), 
        ('maid', 'Maid Service'),
        ('plumber', 'Plumber'),
        ('electrician', 'Electrician'),
        ('carpenter', 'Carpenter'),
        ('internet', 'Internet Provider'),
    ]
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    area = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_type = models.CharField(max_length=20, choices=PRICE_TYPE_CHOICES)
    contact_number = models.CharField(max_length=15, blank=True)
    rating = models.FloatField(default=5.0)
    verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.category})"


# Django Signal: Nayi Service save hote hi automatically Vector DB me sync hogi
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Service)
def auto_sync_service_to_vector_db(sender, instance, **kwargs):
    try:
        from chatbot.rag_engine import index_single_service
        index_single_service(instance)
    except Exception as e:
        print(f"[SIGNAL ERROR] {e}")

