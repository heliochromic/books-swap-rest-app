"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.conf import settings
from django.conf.urls.static import static
from books_rest import views

router = routers.DefaultRouter()

urlpatterns = [
                  path('admin/', admin.site.urls),
                  path('api/admin/users/', views.UserListView.as_view(), name='users'),
                  path('api/', include(router.urls)),
                  path('api/login/', views.LoginView.as_view(), name='login'),
                  path('api/signup/', views.SignUpView.as_view(), name='signup'),
                  path('api/profile/<int:pk>', views.ProfileView.as_view(), name='profile'),
                  path('api/catalog/', views.CatalogView.as_view(), name='catalog'),
                  path('api/catalog/<int:pk>', views.BookItemView.as_view(), name='book-item'),
                  path('api/map/', views.CatalogView.as_view(), name='map'),
                  path('api/requests/', views.RequestView.as_view(), name='requests'),
                  path('api/user/', views.UserView.as_view(), name='user'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
