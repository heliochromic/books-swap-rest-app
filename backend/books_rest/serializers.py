from django.db.models import Q
from rest_framework import serializers
from django.contrib.auth.models import User as DJUser
from .models import User, BookItem, Request, Rating
from django.db.models import Avg


class BookItemSerializer(serializers.ModelSerializer):
    distance = serializers.FloatField(read_only=True)

    class Meta:
        model = BookItem
        fields = '__all__'


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'


class RequestItemSerializer(serializers.ModelSerializer):
    receiver_book = BookItemSerializer()
    sender_book = BookItemSerializer()

    class Meta:
        model = Request
        fields = ['requestID', 'receiver_book', 'sender_book', 'status', 'sending_time', 'approval_time',
                  'deletion_time']


class DJUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DJUser
        fields = ['username', 'email', 'is_staff', 'is_superuser']


class UserLocationSerializer(serializers.ModelSerializer):
    djuser = DJUserSerializer(source='django')
    active_book_items_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['userID', "djuser", 'latitude', 'longitude', 'image', 'active_book_items_count']

    def get_active_book_items_count(self, obj):
        return BookItem.objects.filter(Q(userID_id=obj.userID) &
                                       Q(exchange_time__isnull=True) & Q(deletion_time__isnull=True)).count()


class UserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    book_items = serializers.SerializerMethodField()
    djuser = DJUserSerializer(source='django')
    rating = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['userID', 'first_name', 'last_name', 'date_of_birth', 'mail', 'phone_number', 'latitude', 'longitude',
                  'rating', 'image', 'djuser', 'book_items']
    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.mail = validated_data.get('mail', instance.mail)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.image = validated_data.get('image', instance.image)
        instance.save()
        return instance

    def get_rating(self, obj):
        avg_rating = Rating.objects.filter(ratee=obj).aggregate(Avg('score'))['score__avg']
        return avg_rating if avg_rating is not None else 0

    def get_book_items(self, obj):
        book_items = obj.bookitem_set.filter(Q(exchange_time__isnull=True) & Q(deletion_time__isnull=True))
        return BookItemSerializer(book_items, many=True).data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['book_items'] = self.get_book_items(instance)
        return representation


class UserCatalogSerializer(serializers.ModelSerializer):
    book_items = serializers.SerializerMethodField()
    djuser = DJUserSerializer(source='django')
    rating = serializers.SerializerMethodField()
    has_exchanged = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['userID', 'first_name', 'last_name', 'date_of_birth', 'mail', 'phone_number', 'latitude', 'longitude',
                  'rating', 'image', 'djuser', 'book_items', 'has_exchanged']

    def get_book_items(self, obj):
        book_items = obj.bookitem_set.filter(Q(exchange_time__isnull=True) & Q(deletion_time__isnull=True))
        return BookItemSerializer(book_items, many=True).data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['book_items'] = self.get_book_items(instance)
        return representation

    def get_rating(self, obj):
        avg_rating = Rating.objects.filter(ratee=obj).aggregate(Avg('score'))['score__avg']
        return avg_rating if avg_rating is not None else 0

    def get_has_exchanged(self, obj):
        request = self.context.get('request')
        if not request:
            return False

        user = User.objects.get(userID=request.user.id)
        user_books = BookItem.objects.filter(userID=user)

        has_exchanged = Request.objects.filter(
            Q(sender_book__in=user_books, receiver_book__userID=obj, status="A") |
            Q(receiver_book__in=user_books, sender_book__userID=obj, status="A")
        ).exists()

        return has_exchanged


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
