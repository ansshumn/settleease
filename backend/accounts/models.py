from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('user','User'),
        ('service_provider','Service Provider'),    
    ]

    role = models.CharField(max_length=20,choices=ROLE_CHOICES,default='user')

    city = models.CharField(max_length=100,null=True,blank=True)
    
