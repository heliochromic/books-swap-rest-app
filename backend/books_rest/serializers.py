from rest_framework import serializers

from .models import (Book, User, BookItem, Request)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def update(self, instance, validated_data):
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

    def update(self, instance, validated_data):
        instance.photo = validated_data.get('photo', instance.photo)
        instance.save()
        return instance


class RequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Request
        fields = '__all__'


class BookItemBookJoinedSerializer(serializers.ModelSerializer):
    # write a serializer that will make inner join for two models
    bookID = BookSerializer()

    class Meta:
        model = BookItem
        fields = ['itemID', 'photo', 'status', 'description', 'publish_time', 'deletion_time', 'exchange_time',
                  'bookID', 'userID']
