from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User as DJUser
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BookItem, User, Request
from .serializers import BookItemSerializer, UserSerializer, RequestSerializer


class CatalogView(APIView):

    @action(detail=False, methods=['get'])
    def get(self, request):
        queryset = BookItem.objects.all()
        serializer = BookItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def post(self, request):
        pass


class BookItemView(APIView):

    @action(detail=False, methods=['get'])
    def get(self, request, pk):
        pass

    @action(detail=False, methods=['post'])
    def post(self, request, pk):
        pass

    @action(detail=False, methods=['put'])
    def put(self, request, pk):
        pass

    @action(detail=False, methods=['delete'])
    def delete(self, request, pk):
        pass


class RequestView(APIView):

    @action(detail=False, methods=['get'])
    def get(self, request):
        pass


class UserView(APIView):

    @action(detail=False, methods=['post'])
    def post(self, request):
        user_id = request.data['userID']
        try:
            queryset = User.objects.get(userID=user_id)
            serializer = UserSerializer(queryset)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(data={"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['put'])
    def put(self, request):
        try:
            user = User.objects.get(userID=request.data['userID'])
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user.userID = request.data['userID']
        user.first_name = request.data['first_name']
        user.last_name = request.data['last_name']
        user.age = request.data['age']
        user.mail = request.data['mail']
        user.phone_number = request.data['phone_number']
        user.latitude = request.data['latitude']
        user.longitude = request.data['longitude']
        user.rating = request.data['rating']
        user.image = request.data['image']
        user.save()
        serializer = UserSerializer(user, many=False)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'])
    def delete(self, request):
        userID = request.data['userID']

        if not userID:
            return Response({"error": "userID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(userID=userID)
            django_id = user.django.id
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        with transaction.atomic():
            user.delete()
            user = DJUser.objects.get(id=django_id)
            Token.objects.filter(user=user).delete()
            user.groups.clear()
            user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)


class ProfileView(APIView):

    @action(detail=False, methods=['get'])
    def get(self, request, pk):
        userID = pk

        user = User.objects.get(userID=userID)

        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LoginView(APIView):

    @action(detail=False, methods=['post'])
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class SignUpView(APIView):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        age = request.data['age']
        mail = request.data['mail']
        phone_number = request.data['phone_number']
        latitude = request.data['latitude']
        longitude = request.data['longitude']
        rating = request.data['rating']
        image = request.data['image']

        if not username or not password or not mail:
            return Response({"error": "Username, password, and email are required"},
                            status=status.HTTP_400_BAD_REQUEST)

        if DJUser.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        if DJUser.objects.filter(email=mail).exists():
            return Response({"error": "Email already in use"}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            djuser = DJUser(username=username, email=mail)
            djuser.set_password(password)
            djuser.save()
            user = DJUser.objects.latest('id').id

            custom_user = User(first_name=first_name, last_name=last_name, age=age, mail=mail,
                               phone_number=phone_number, latitude=latitude, longitude=longitude,
                               rating=rating, image=image, django_id=user)
            custom_user.save()
            token, created = Token.objects.get_or_create(user=djuser)

        return Response({"message": "User created successfully", "token": token.key},
                        status=status.HTTP_201_CREATED)


class UserListView(APIView):

    @action(methods=['get'], detail=False)
    def get(self, request):
        my_id = request.data.get('userID')
        queryset = User.objects.exclude(userID=my_id)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
