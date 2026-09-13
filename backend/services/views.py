from rest_framework import generics
from .models import Service
from .serializers import ServiceSerializer


class ServiceListCreateView(generics.ListCreateAPIView):
    serializer_class = ServiceSerializer

    def get_queryset(self):
        queryset = Service.objects.all().order_by('-created_at')
        
        my_services = self.request.query_params.get('my_services')
        if my_services == 'true':
            if self.request.user.is_authenticated:
                return queryset.filter(user=self.request.user)
            return Service.objects.none()

        category = self.request.query_params.get('category')
        city = self.request.query_params.get('city')
        price_min = self.request.query_params.get('priceMin')
        price_max = self.request.query_params.get('priceMax')

        if category:
            queryset = queryset.filter(category=category)
        if city:
            queryset = queryset.filter(city__icontains=city)
        if price_min:
            queryset = queryset.filter(price__gte=price_min)
        if price_max:
            queryset = queryset.filter(price__lte=price_max)

        return queryset

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)

# 2. Kisi Ek Service ki detail dekhna (GET), edit karna (PUT), ya delete karna (DELETE)
class ServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

