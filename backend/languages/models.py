from django.db import models

class Phrase(models.Model):
    category = models.CharField(max_length=100) # e.g., "Greetings", "Shopping"
    english = models.CharField(max_length=200, blank=True)
    hindi = models.CharField(max_length=200, blank=True)
    tamil = models.CharField(max_length=200, blank=True)
    kannada = models.CharField(max_length=200, blank=True)
    bengali = models.CharField(max_length=200, blank=True)
    marathi = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"[{self.category}] {self.english}"
