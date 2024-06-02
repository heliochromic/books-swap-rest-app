from rest_framework import serializers
from django.contrib.auth.models import User as DJUser
from .models import User, BookItem, Request


class BookSerializer(serializers.Serializer):
    ISBN = serializers.CharField(allow_null=True)
    title = serializers.CharField(allow_null=True)
    author = serializers.CharField(allow_null=True)
    genre = serializers.CharField(allow_null=True)
    language = serializers.CharField(allow_null=True)
    pages = serializers.IntegerField(allow_null=True)
    year = serializers.CharField(allow_null=True)
    description = serializers.CharField(allow_blank=True, allow_null=True)

    # @staticmethod
    # def validate_year(value):
    #     if not value.isdigit() or len(value) != 4:
    #         raise serializers.ValidationError("Year must be a 4-digit string.")
    #     return value


class BookItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookItem
        fields = '__all__'


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'


class DJUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DJUser
        fields = ['username', 'email', 'is_staff']


class UserLocationSerializer(serializers.ModelSerializer):
    djuser = DJUserSerializer(source='django')
    active_book_items_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['userID', "djuser", 'latitude', 'longitude', 'image', 'active_book_items_count']

    def get_active_book_items_count(self, obj):
        return BookItem.objects.filter(userID=obj.userID, status='A').count()


class UserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)
    djuser = DJUserSerializer(source='django')

    class Meta:
        model = User
        fields = ['userID', 'first_name', 'last_name', 'date_of_birth', 'mail', 'phone_number', 'latitude', 'longitude', 'rating',
                  'image', 'djuser']

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.date_of_birth = validated_data.get('date_of_birth', instance.date_of_birth)
        instance.mail = validated_data.get('mail', instance.mail)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.image = validated_data.get('image', instance.image)
        instance.save()
        return instance


class UserCatalogSerializer(serializers.ModelSerializer):
    book_items = BookItemSerializer(many=True, read_only=True, source='bookitem_set')
    djuser = DJUserSerializer(source='django')

    class Meta:
        model = User
        fields = ['userID', 'first_name', 'last_name', 'date_of_birth', 'mail', 'phone_number', 'latitude', 'longitude', 'rating',
                  'image', 'djuser', 'book_items']


class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
