from rest_framework import serializers

from .models import (Book, User, BookItem, Request)


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class BookItemSerializer(serializers.ModelSerializer):
    bookID = BookSerializer()

    class Meta:
        model = BookItem
        fields = ['itemID', 'photo', 'status', 'description', 'publish_time', 'deletion_time', 'exchange_time',
                  'bookID', 'userID']


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'
