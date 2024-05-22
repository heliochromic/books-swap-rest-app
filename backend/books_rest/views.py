from datetime import datetime

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User as DJUser
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import BookItem, User, Request
from .serializers import BookItemSerializer, UserSerializer, RequestSerializer, BookItemBookJoinedSerializer


class CatalogView(APIView):
    parser_classes = [FormParser, MultiPartParser]

    @action(detail=False, methods=['get'])  # отримати каталог усіх книг без фільтрів
    def get(self, request):
        queryset = BookItem.objects.all()
        serializer = BookItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])  # додати книгу (токен)
    def post(self, request, *args, **kwargs):
        serializer = BookItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookItemView(APIView):

    @action(detail=False, methods=['get'])  # сторінка книги
    def get(self, request, pk):
        try:
            book_item_instance = BookItem.objects.get(itemID=pk)
        except User.DoesNotExist:
            return Response(data={"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BookItemBookJoinedSerializer(instance=book_item_instance)
        return Response(serializer.data)

    @action(detail=False, methods=['put'])  # змінити свою книгу (токен) ((поки воно йде з запиту))
    def put(self, request, pk):
        try:
            book_item_instance = BookItem.objects.get(itemID=pk)
        except BookItem.DoesNotExist:
            return Response(data={"error": "Book item not found"}, status=status.HTTP_404_NOT_FOUND)

        book_item_instance.photo = request.data.get('photo', book_item_instance.photo)
        book_item_instance.status = request.data.get('status', book_item_instance.status)
        book_item_instance.description = request.data.get('description', book_item_instance.description)
        book_item_instance.publish_time = request.data.get('publish_time', book_item_instance.publish_time)
        book_item_instance.deletion_time = request.data.get('deletion_time', book_item_instance.deletion_time)
        book_item_instance.exchange_time = request.data.get('exchange_time', book_item_instance.exchange_time)
        book_item_instance.save()

        serializer = BookItemBookJoinedSerializer(instance=book_item_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'])  # видалити свою книгу (токен) ((поки воно йде з запиту))
    def delete(self, request, pk):
        try:
            book_item_instance = BookItem.objects.get(itemID=pk)
        except BookItem.DoesNotExist:
            return Response(data={"error": "Book item not found"}, status=status.HTTP_404_NOT_FOUND)

        book_item_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RequestView(APIView):

    @action(detail=False, methods=['get'])  # отримати всі свої запити на книгу (токен) ((поки воно йде з запиту))
    def get(self, request):
        receiver_id = request.data.get("receiver_book_id")

        if not receiver_id:
            return Response(data={"error": "Receiver book ID not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            queryset = Request.objects.filter(receiver_book__itemID=receiver_id)
        except BookItem.DoesNotExist:
            return Response(data={"error": "Book item not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RequestSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])  # зробити запит на книгу (токен) ((поки воно йде з запиту))
    def post(self, request, pk):
        receiver_id = request.data.get("receiver_book_id")
        book_status = request.data.get('status')

        if not receiver_id:
            return Response(data={"error": "Receiver book ID not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            sender_book_instance = BookItem.objects.get(itemID=pk)
            receiver_book_instance = BookItem.objects.get(itemID=receiver_id)
        except BookItem.DoesNotExist:
            return Response(data={"error": "Book item not found"}, status=status.HTTP_404_NOT_FOUND)

        if sender_book_instance.itemID == receiver_book_instance.itemID:
            return Response(data={"error": "Sender and receiver books cannot be the same"},
                            status=status.HTTP_400_BAD_REQUEST)

        request_instance = Request.objects.create(
            sender_book=sender_book_instance,
            receiver_book=receiver_book_instance,
            status=book_status,
            sending_time=datetime.now()
        )

        serializer = RequestSerializer(instance=request_instance)

        return Response(data=serializer.data, status=status.HTTP_201_CREATED)


class CatalogItemView(APIView):
    @action(detail=False, methods=['get'])  # отримати свій запит на книгу (токен)
    def get(self, request, pk):
        pass

    @action(detail=False, methods=['post'])  # підтвердити свій запит на книгу (токен)
    def post(self, request, pk):
        pass

    @action(detail=False, methods=['delete'])  # видалити свій запит на книгу (токен)
    def delete(self, request, pk):
        pass


class UserView(APIView):

    @action(detail=False, methods=['post', 'put'])  # отримати або редагувати сторінку свого профілю (токен)
    def post(self, request):
        user_id = request.data.get('userID')
        try:
            user_instance = User.objects.get(userID=user_id)
        except User.DoesNotExist:
            return Response(data={"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user_instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])  # видалення свого профілю (токен)
    def delete(self, request):
        user_id = request.data.get('userID')
        try:
            user_instance = User.objects.get(userID=user_id)
        except User.DoesNotExist:
            return Response(data={"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        django_id = user_instance.django.id

        with transaction.atomic():
            user_instance.delete()
            user = DJUser.objects.get(id=django_id)
            Token.objects.filter(user=user).delete()
            user.groups.clear()
            user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)


class ProfileView(APIView):

    @action(detail=False, methods=['get'])  # отримати сторінку чужого профілю
    def get(self, request, pk):
        userID = pk
        user = User.objects.get(userID=userID)
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LoginView(APIView):

    @action(detail=False, methods=['post'])  # логін
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

    @action(detail=False, methods=['post'])  # сайн ап
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


class MapView(APIView):

    @action(detail=False, methods=['get'])
    def get(self, request):
        pass
