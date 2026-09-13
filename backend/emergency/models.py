
from django.db import models

class EmergencyContact(models.Model):
    TYPE_CHOICES = [
        ('hospital', 'Hospital'),
        ('police', 'Police'),
        ('pharmacy', 'Pharmacy')
    ]
    
    pincode = models.CharField(max_length=10)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    name = models.CharField(max_length=200)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.get_type_display()}) - {self.pincode}"

# Create your models here.
