from rest_framework import serializers
from .models import EmergencyContact

class EmergencyContactSerializers(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = '__all__'