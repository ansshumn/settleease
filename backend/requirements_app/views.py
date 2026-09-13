from rest_framework import generics
from .models import Requirement, RequirementResponse
from .serializers import RequirementSerializer, RequirementResponseSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class RequirementListCreateView(generics.ListCreateAPIView):
    serializer_class = RequirementSerializer

    def get_queryset(self):
        queryset = Requirement.objects.all()
        
        my_only = self.request.query_params.get('my')
        if my_only == 'true':
            if self.request.user.is_authenticated:
                return queryset.filter(user=self.request.user).order_by('-created_at')
            return Requirement.objects.none()

        # When browsing requirements, default to open requirements
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        else:
            queryset = queryset.filter(status='open')

        area = self.request.query_params.get('area')
        category = self.request.query_params.get('category')

        if area:
            queryset = queryset.filter(area__icontains=area)
        if category:
            queryset = queryset.filter(category__iexact=category)

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else User.objects.first()
        serializer.save(user=user)


class RequirementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Requirement.objects.all()
    serializer_class = RequirementSerializer


class RequirementResponseCreateView(generics.CreateAPIView):
    serializer_class = RequirementResponseSerializer

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else User.objects.first()
        provider_name = user.first_name or user.username or 'Provider'
        req_id = self.kwargs.get('pk')
        requirement = Requirement.objects.get(pk=req_id)
        
        from services.models import Service
        service = Service.objects.filter(user=user).first()
        service_name = service.name if service else f"{provider_name} Services"
        phone = getattr(user, 'phone', '') or (service.contact_number if service else '')
        
        serializer.save(
            requirement=requirement,
            provider=user,
            provider_name=provider_name,
            provider_phone=phone,
            provider_service_name=service_name
        )


class RequirementResponseListView(generics.ListAPIView):
    serializer_class = RequirementResponseSerializer

    def get_queryset(self):
        req_id = self.kwargs.get('pk')
        return RequirementResponse.objects.filter(requirement_id=req_id).order_by('-created_at')

