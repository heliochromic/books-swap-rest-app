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
from books_rest import views

router = routers.DefaultRouter()
# router.register(r'catalog', views.CatalogView.as_view, basename='catalog')
# router.register(r'catalog/<int:pk>', views.CatalogItemView, basename='catalog-item')
# router.register(r'requests', views.RequestView, basename='requests')
# router.register(r'user', views.UserView, basename='user')
# router.register(r'login', views.LoginView, basename='login')
# router.register(r'signup', views.SignUpView, basename='signup')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/catalog/', views.CatalogView.as_view(), name='catalog'),
    path('api/catalog/<int:pk>', views.CatalogView.as_view(), name='catalog-item'),
    path('api/requests/', views.RequestView.as_view(), name='requests'),
    path('api/user/', views.UserView.as_view(), name='user'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path('api/singup', views.SignUpView.as_view(), name='sing-up')
]
