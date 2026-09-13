from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, UserProfileView, EmailLoginView, AdminUserListView, AdminDeleteUserView

urlpatterns = [
    # 1. Registration endpoint (Naya account banana)
    path('register/', RegisterView.as_view(), name='register'),

    # 2. Login endpoint — Email ya Username dono se login hoga
    path('login/', EmailLoginView.as_view(), name='login'),

    # 3. Refresh Token endpoint
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # 4. Profile endpoint (Logged-in user details dekhne ke liye)
    path('profile/', UserProfileView.as_view(), name='profile'),

    # 5. Admin — list all users
    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),

    # 6. Admin — delete a user by ID
    path('admin/users/<int:pk>/delete/', AdminDeleteUserView.as_view(), name='admin-delete-user'),
]
