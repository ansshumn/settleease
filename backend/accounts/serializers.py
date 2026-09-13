from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username','email','password','role','city','first_name','last_name']

    def validate_email(self, value):
        """Email already registered hai toh error do"""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("This email is already registered. Please login instead.")
        return value.lower()

    def validate_username(self, value):
        """Username already exists toh error do"""
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("This username is already taken. Please choose another.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.get('username', ''),
            password=validated_data.get('password'),
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role'),
            city=validated_data.get('city'),
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'city', 'first_name', 'last_name', 'is_staff', 'is_superuser']
