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

    def create(self, validated_data):
        book_data = validated_data.pop('bookID')
        book, created = Book.objects.get_or_create(bookID=book_data['bookID'], defaults=book_data)
        book_item = BookItem.objects.create(bookID=book, **validated_data)
        return book_item

    def update(self, instance, validated_data):
        instance.photo = validated_data.get('photo', instance.photo)
        instance.save()
        return instance


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'
