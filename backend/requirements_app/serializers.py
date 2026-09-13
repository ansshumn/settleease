from rest_framework import serializers
from .models import Requirement, RequirementResponse

class RequirementResponseSerializer(serializers.ModelSerializer):
    provider = serializers.PrimaryKeyRelatedField(read_only=True)
    requirement = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = RequirementResponse
        fields = '__all__'
        read_only_fields = ['provider', 'requirement', 'created_at']


class RequirementSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    responses = RequirementResponseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Requirement
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
