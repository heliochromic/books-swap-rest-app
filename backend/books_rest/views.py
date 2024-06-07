from datetime import datetime
import os
from django.contrib.auth import authenticate, login
from django.db.models import F, FloatField, ExpressionWrapper, Value
from django.contrib.auth.models import User as DJUser
from django.db import transaction
from django.db.models.functions import Radians, ACos, Cos, Sin
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q

from .models import BookItem, User, Request
from .serializers import BookItemSerializer, UserSerializer, RequestSerializer, \
    UserLocationSerializer, UserCatalogSerializer, PasswordChangeSerializer, RequestItemSerializer


class CatalogView(APIView):
    parser_classes = [FormParser, MultiPartParser]
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['get'])
    def get(self, request):
        user = User.objects.filter(django=request.user).first()
        user_lat = user.latitude
        user_lon = user.longitude

        queryset = BookItem.objects.exclude(userID_id=request.user.id).filter(
            Q(exchange_time__isnull=True) & Q(deletion_time__isnull=True)
        ).annotate(
            latitude=F('userID__latitude'),
            longitude=F('userID__longitude'),
        ).annotate(
            distance=ExpressionWrapper(
                6371 * ACos(
                    Cos(Radians(Value(user_lat))) * Cos(Radians(F('latitude'))) *
                    Cos(Radians(F('longitude')) - Radians(Value(user_lon))) +
                    Sin(Radians(Value(user_lat))) * Sin(Radians(F('latitude')))
                ), output_field=FloatField()
            )
        )
        serializer = BookItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])
    def post(self, request, *args, **kwargs):
        data = request.data

        isbn = data.get('isbn')
        title = data.get('title')
        author = data.get('author')
        genre = data.get('genre')
        language = data.get('language')
        pages = data.get('pages')
        year = data.get('year')
        description = data.get('description')
        book_status = data.get('status')
        user_id = request.user.id
        photo = data.get('file1')
        photo2 = data.get('file2')
        photo3 = data.get('file3')

        book_item_data = {
            'ISBN': isbn,
            'title': title,
            'author': author,
            'genre': genre,
            'language': language,
            'pages': int(pages),
            'year': year,
            'description': description,
            'status': book_status,
            'userID': user_id,
            'photo': photo,
            'photo2': photo2,
            'photo3': photo3,
            'publish_time': datetime.now()
        }

        serializer = BookItemSerializer(data=book_item_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        print(serializer.errors)
        return Response(serializer.errors, status=400)


class BookItemView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['get'])  # сторінка книги
    def get(self, request, pk):
        try:
            book_item_instance = BookItem.objects.get(itemID=pk)
        except User.DoesNotExist:
            return Response(data={"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = BookItemSerializer(instance=book_item_instance)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])  # зробити запит на книгу
    def post(self, request, pk):
        receiver_book_id = request.data.get('receiver_book_id')  # тут ти пропонуєш свою книгу

        if not receiver_book_id:
            return Response(data={"error": "Receiver book ID not provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            sender_book_instance = BookItem.objects.get(itemID=pk)
            receiver_book_instance = BookItem.objects.get(itemID=receiver_book_id)
        except BookItem.DoesNotExist:
            return Response(data={"error": "Book item not found"}, status=status.HTTP_404_NOT_FOUND)

        if sender_book_instance.userID.userID == receiver_book_instance.userID.userID:
            return Response(data={"error": "Sender and receiver books cannot be the same"},
                            status=status.HTTP_400_BAD_REQUEST)

        request_instance = Request.objects.create(
            sender_book=sender_book_instance,
            receiver_book=receiver_book_instance,
            status="P",
            sending_time=datetime.now()
        )

        serializer = RequestSerializer(instance=request_instance)

        return Response(data=serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['put'])  # змінити свою книгу (токен) ((поки воно йде з запиту))
    def put(self, request, pk):
        try:
            book_item_instance = BookItem.objects.get(itemID=pk)
        except BookItem.DoesNotExist:
            return Response(data={"error": "Book item not found"}, status=status.HTTP_404_NOT_FOUND)

        if not (request.user.is_staff or book_item_instance.userID.django_id == request.user.id):
            return Response(data={"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        book_item_instance.photo = request.data.get('photo', book_item_instance.photo)
        book_item_instance.status = request.data.get('status', book_item_instance.status)
        book_item_instance.description = request.data.get('description', book_item_instance.description)
        book_item_instance.publish_time = request.data.get('publish_time', book_item_instance.publish_time)
        book_item_instance.deletion_time = request.data.get('deletion_time', book_item_instance.deletion_time)
        book_item_instance.exchange_time = request.data.get('exchange_time', book_item_instance.exchange_time)
        book_item_instance.save()

        serializer = BookItemSerializer(instance=book_item_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'])  # видалити свою книгу (токен)
    def delete(self, request, pk):
        try:
            book_item_instance = BookItem.objects.get(itemID=pk)
        except BookItem.DoesNotExist:
            return Response(data={"error": "Book item not found"}, status=status.HTTP_404_NOT_FOUND)

        if not (request.user.is_staff or book_item_instance.userID.django_id == request.user.id):
            return Response(data={"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        book_item_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CatalogMyItemsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['get'])
    def get(self, request):
        queryset = BookItem.objects.filter(userID=request.user.id)
        serializer = BookItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RequestView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['get'])
    def get(self, request, request_type):
        user_id = request.user.id

        print(request_type)

        if request_type == "my_requests":
            queryset = Request.objects.filter(sender_book_id__userID=user_id, status="P")
        elif request_type == "requests_to_me":
            queryset = Request.objects.filter(receiver_book_id__userID=user_id, status="P")
        elif request_type == "rejected":
            queryset = Request.objects.filter(receiver_book_id__userID=user_id, status="R")
        elif request_type == "confirmed":
            queryset = Request.objects.filter(receiver_book_id__userID=user_id, status="A")
        else:
            return Response(data={"error": "Invalid request type"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = RequestItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class RequestItemView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['put'])  # видалення або схвалення запиту на книгу
    def put(self, request, pk):
        receiver_id = request.user.id  # я зараз sender
        request_status = request.data.get('status')

        if request_status not in ["A", "R"]:
            return Response(data={"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            request_instance = Request.objects.get(requestID=pk)
            sender_book_item_instance = BookItem.objects.get(itemID=request_instance.sender_book_id)
            receiver_book_item_instance = BookItem.objects.get(itemID=request_instance.receiver_book_id)
        except Request.DoesNotExist:
            print("hehehehe")
            return Response(data={"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)
        except BookItem.DoesNotExist:
            print("hehehehe")
            return Response(data={"error": "BookItem not found"}, status=status.HTTP_404_NOT_FOUND)

        if request_instance.status != "P":
            return Response(data={"error": "Request was already approved or removed"},
                            status=status.HTTP_406_NOT_ACCEPTABLE)

        if receiver_id != receiver_book_item_instance.userID.userID:
            return Response(data={"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        time = datetime.now()

        request_instance.status = request_status

        if request_status == "A":
            request_instance.approval_time = time
            sender_book_item_instance.exchange_time = time
            receiver_book_item_instance.exchange_time = time
        elif request_status == "R":
            request_instance.deletion_time = time

        with transaction.atomic():
            request_instance.save()
            sender_book_item_instance.save()
            receiver_book_item_instance.save()

        serializer = RequestSerializer(instance=request_instance)
        return Response(data=serializer.data, status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=['get'])  # отримати або редагувати сторінку свого профілю (токен)
    def get(self, request):
        user_id = request.user.id
        try:
            user_instance = User.objects.get(userID=user_id)
        except User.DoesNotExist:
            return Response(data={"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        if not (request.user.is_staff or user_instance.django_id == request.user.id):
            return Response(data={"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        serializer = UserSerializer(user_instance, data=request.data, partial=True)
        if serializer.is_valid():
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['put'])  # Update user profile
    def put(self, request, format=None):
        dir_path = os.path.dirname(os.path.realpath(__file__))
        media_dir = os.path.normpath(os.path.join(dir_path, '..', 'media\\'))
        user_id = request.user.id
        try:
            user_instance = User.objects.get(userID=user_id)
        except User.DoesNotExist:
            return Response(data={"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if not (request.user.is_staff or user_instance.django_id == request.user.id):
            return Response(data={"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        uploaded_image = request.data.get('image')
        if uploaded_image is None:
            if not request.data.get('imageNotUpdated') and user_instance.image.name != 'images/users/default.png':
                os.remove(os.path.normpath(media_dir + "\\" + user_instance.image.name))
                user_instance.image = 'images/users/default.png'
        else:

            uploaded_image_name = uploaded_image.name
            current_image_name = user_instance.image.name

            if current_image_name != 'images/users/default.png' and uploaded_image_name != current_image_name:
                print("Deleting " + media_dir + current_image_name)
                os.remove(os.path.normpath(media_dir + "\\" + current_image_name))

            print(f"Uploaded image: {uploaded_image_name}")
            print(f"Current image: {current_image_name}")
        serializer = UserSerializer(user_instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])  # видалення свого профілю (токен)
    def delete(self, request):
        user_id = request.user.id
        try:
            user_instance = User.objects.get(userID=user_id)
        except User.DoesNotExist:
            return Response(data={"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if not (request.user.is_staff or user_instance.django_id == request.user.id):
            return Response(data={"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        django_id = user_instance.django.id if user_instance.django_id else None

        with transaction.atomic():
            user_instance.delete()
            if django_id:
                user = DJUser.objects.get(id=django_id)
                Token.objects.filter(user=user).delete()
                user.groups.clear()
                user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['get'])  # отримати сторінку чужого профілю
    def get(self, request, pk):
        userID = pk
        user = User.objects.get(userID=userID)
        if not user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserCatalogSerializer(user, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'])  # видалення чужого профілю (токен)
    def delete(self, request, pk):
        user_id = pk
        try:
            user_instance = User.objects.get(userID=user_id)
        except User.DoesNotExist:
            return Response(data={"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if not (request.user.is_staff or user_instance.django_id == request.user.id):
            return Response(data={"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        django_id = user_instance.django.id if user_instance.django_id else None

        with transaction.atomic():
            user_instance.delete()
            if django_id:
                user = DJUser.objects.get(id=django_id)
                Token.objects.filter(user=user).delete()
                user.groups.clear()
                user.delete()
        return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)


class LoginView(APIView):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])  # логін
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key, "message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class SignUpView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    @action(detail=False, methods=['post'])  # сайн ап
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        first_name = request.data['first_name']
        last_name = request.data['last_name']
        date_of_birth = request.data['date_of_birth']
        mail = request.data['mail']
        phone_number = request.data['phone_number']
        latitude = request.data['latitude']
        longitude = request.data['longitude']
        image = request.data.get('image')

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

            custom_user = User(first_name=first_name, last_name=last_name, date_of_birth=date_of_birth, mail=mail,
                               phone_number=phone_number, latitude=latitude, longitude=longitude,
                               image=image, django_id=user)
            custom_user.save()
            token, created = Token.objects.get_or_create(user=djuser)

        return Response({"message": "User created successfully", "token": token.key},
                        status=status.HTTP_201_CREATED)


class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    @action(methods=['get'], detail=False)
    def get(self, request):
        if not request.user.is_staff:
            return Response(data={"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        my_id = request.data.get('userID')
        queryset = User.objects.exclude(userID=my_id)
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)


class MapView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['get'])
    def get(self, request):
        users = User.objects.exclude(userID=request.user.id)
        serializer = UserLocationSerializer(users, many=True)
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['post'])
    def post(self, request):
        try:
            token = Token.objects.get(user=request.user)
            token.delete()
            return Response(status=status.HTTP_200_OK, data={"message": "Successfully logged out"})
        except Token.DoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={"error": "Token not found"})


class PasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['post'])
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = request.user
        if not user.check_password(serializer.validated_data['current_password']):
            return Response({"current_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({"detail": "Password has been changed successfully."}, status=status.HTTP_200_OK)


class MakeAdminView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['post'])
    def post(self, request):
        user_id = request.data.get("targetID")
        try:
            user_instance = User.objects.get(userID=user_id)
        except User.DoesNotExist:
            return Response(data={"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        django_id = user_instance.django.id if user_instance.django_id else None

        with transaction.atomic():
            user = DJUser.objects.get(id=django_id)
            user.is_staff = True
            user.save()
        return Response({"message": "User received admin status successfully"}, status=status.HTTP_200_OK)


class RemoveAdminView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]
    authentication_classes = [TokenAuthentication]

    @action(detail=False, methods=['post'])
    def post(self, request):
        user_id = request.data.get("targetID")
        try:
            user_instance = User.objects.get(userID=user_id)
        except User.DoesNotExist:
            return Response(data={"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        django_id = user_instance.django.id if user_instance.django_id else None

        with transaction.atomic():
            user = DJUser.objects.get(id=django_id)
            user.is_staff = False
            user.save()
        return Response({"message": "User received admin status successfully"}, status=status.HTTP_200_OK)
