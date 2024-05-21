from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BookItem, User, Request
from .serializers import BookItemSerializer, UserSerializer, RequestSerializer


# Create your views here.
class CatalogView(APIView):

    @action(detail=False, methods=['get'])
    def get(self, request):
        queryset = BookItem.objects.all()
        serializer = BookItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def post(self, request):
        pass


class CatalogItemView(APIView):
    @action(detail=False, methods=['get'])
    def get(self, request):
        queryset = BookItem.objects.all()
        serializer = BookItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BookItemView(APIView):
    serializer_class = BookItemSerializer
    queryset = BookItem.objects.all()

    def get(self, request):
        pass


class RequestView(APIView):
    serializer_class = RequestSerializer
    queryset = Request.objects.all()

    def get(self, request):
        pass


class UserView(APIView):
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


class LoginView(APIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def post(self, request):
        pass


class SignUpView(APIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def post(self, request):
        pass
