from rest_framework import generics
from .models import EmergencyContact
from .serializers import EmergencyContactSerializers

class EmergencyContactListView(generics.ListCreateAPIView):
    serializer_class = EmergencyContactSerializers

    def get_queryset(self):
        queryset = EmergencyContact.objects.all() 

        pincode = self.request.query_params.get('pincode')
        contact_type = self.request.query_params.get('type')
        if pincode:
            queryset = queryset.filter(pincode=pincode)
        if contact_type:
            queryset = queryset.filter(type=contact_type)
        return queryset