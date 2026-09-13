from django.urls import path
from .views import EmergencyContactListView

urlpatterns = [
    path('',EmergencyContactListView.as_view(), name = 'emergency-list-create'),
]