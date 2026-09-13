from django.urls import path
from .views import (
    RequirementListCreateView, 
    RequirementDetailView, 
    RequirementResponseCreateView, 
    RequirementResponseListView
)

urlpatterns = [
    path('', RequirementListCreateView.as_view(), name='requirement-list-create'),
    path('<int:pk>/', RequirementDetailView.as_view(), name='requirement-detail'),
    path('<int:pk>/respond/', RequirementResponseCreateView.as_view(), name='requirement-respond'),
    path('<int:pk>/responses/', RequirementResponseListView.as_view(), name='requirement-responses'),
]
