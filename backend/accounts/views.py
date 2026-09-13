from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()

# 1. Register View (Naya User Banane Ke Liye)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# 2. Custom Login View — Email ya Username dono se login ho sake
class EmailLoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username_or_email = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username_or_email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Email se dhundo
        user = None
        if '@' in username_or_email:
            user = User.objects.filter(email__iexact=username_or_email).first()
        else:
            user = User.objects.filter(username__iexact=username_or_email).first()

        if user is None or not user.check_password(password):
            return Response({'error': 'Invalid email or password. Please try again.'}, status=status.HTTP_401_UNAUTHORIZED)

        # JWT tokens generate karo
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

# 3. Profile View (Logged-in User Apni Details Dekhne Ke Liye)
class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# 4. Admin User List View
class AdminUserListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return User.objects.all().order_by('-date_joined')


# 5. Admin Delete User View
class AdminDeleteUserView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return User.objects.all()

    def destroy(self, request, *args, **kwargs):
        user_to_delete = self.get_object()
        # Apne aap ko delete karne se roko
        if user_to_delete == request.user:
            return Response({'error': 'Aap apna account delete nahi kar sakte.'}, status=status.HTTP_400_BAD_REQUEST)
        user_to_delete.delete()
        return Response({'message': 'User successfully delete ho gaya.'}, status=status.HTTP_200_OK)
