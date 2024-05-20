from rest_framework import viewsets

from .models import BookItem, User, Request
from .serializers import BookItemSerializer, UserSerializer, RequestSerializer


# Create your views here.
class CatalogView(viewsets.ModelViewSet):
    serializer_class = BookItemSerializer
    queryset = BookItem.objects.all()

    def get(self, request):
        pass

    def post(self, request):
        pass


class BookItemView(viewsets.ModelViewSet):
    serializer_class = BookItemSerializer
    queryset = BookItem.objects.all()

    def get(self, request):
        pass


class RequestView(viewsets.ModelViewSet):
    serializer_class = RequestSerializer
    queryset = Request.objects.all()

    def get(self, request):
        pass


class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def post(self, request):
        pass

    def put(self, request):
        pass

    def delete(self, request):
        pass

    def get(self, request):
        pass


class LoginView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def post(self, request):
        pass


class SignUpView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def post(self, request):
        pass



