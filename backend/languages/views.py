from rest_framework import generics
from .models import Phrase
from .serializers import PhraseSerializer


class PhraseListView(generics.ListAPIView):
    serializer_class = PhraseSerializer
    
    def get_queryset(self):
        queryset = Phrase.objects.all()

        category = self.request.query_params.get('category')

        if category:
            queryset = queryset.filter(category=category)
        return queryset
