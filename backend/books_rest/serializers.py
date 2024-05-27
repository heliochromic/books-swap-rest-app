from rest_framework import serializers
from django.contrib.auth.models import User as DJUser
from .models import (Book, User, BookItem, Request)


class UserSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = '__all__'

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.age = validated_data.get('age', instance.age)
        instance.mail = validated_data.get('mail', instance.mail)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        instance.latitude = validated_data.get('latitude', instance.latitude)
        instance.longitude = validated_data.get('longitude', instance.longitude)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.image = validated_data.get('image', instance.image)
        instance.save()
        return instance


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class BookItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookItem
        fields = '__all__'


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'


class BookItemBookJoinedSerializer(serializers.ModelSerializer):
    # write a serializer that will make inner join for two models
    bookID = BookSerializer()

    class Meta:
        model = BookItem
        fields = ['itemID', 'photo', 'photo2', 'photo3', 'status', 'description', 'publish_time', 'deletion_time',
                  'exchange_time', 'bookID', 'userID']


class DJUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = DJUser
        fields = ['username', 'email']


class UserLocationSerializer(serializers.ModelSerializer):
    djuser = DJUserSerializer(source='django')
    active_book_items_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['userID', "djuser", 'latitude', 'longitude','image', 'active_book_items_count']

    def get_active_book_items_count(self, obj):

        return BookItem.objects.filter(userID=obj.userID, status='a').count()


