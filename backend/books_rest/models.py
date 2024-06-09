from datetime import datetime

from django.conf import settings
from django.db import models
from django.urls import reverse


# Create your models here.


class User(models.Model):
    userID = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50, help_text="Enter your first name")
    last_name = models.CharField(max_length=50, help_text="Enter your last name")
    date_of_birth = models.DateField(help_text="Enter your date of birth", null=True)
    mail = models.EmailField(help_text="Enter your mail")
    phone_number = models.CharField(max_length=10, help_text="Enter your phone number")
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)
    image = models.ImageField(upload_to='images/users/', help_text="Upload your image",
                              default='images/users/default.png', null=False)
    registration_date = models.DateField(default=datetime.now)
    django = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.first_name}, {self.last_name}"

    def save(self, *args, **kwargs):
        if not self.image:
            self.image = 'images/users/default.png'
        super(User, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('user', kwargs={'pk': str(self.userID)})


class Rating(models.Model):
    rater = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_ratings')
    ratee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_ratings')
    score = models.IntegerField()

    def __str__(self):
        return f'Rating from {self.rater} to {self.ratee} - Score: {self.score}'


class BookItem(models.Model):
    itemID = models.AutoField(primary_key=True)
    userID = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=1, default='a')
    photo = models.ImageField(upload_to='images/books/', help_text="Upload the first image of the book")
    photo2 = models.ImageField(upload_to='images/books/', help_text="Upload the second image of the book", null=True)
    photo3 = models.ImageField(upload_to='images/books/', help_text="Upload the third image of the book", null=True)
    publish_time = models.DateTimeField(default=datetime.now)
    deletion_time = models.DateTimeField(null=True)
    exchange_time = models.DateTimeField(null=True)
    ISBN = models.CharField(max_length=13, help_text="Enter the ISBN of the book", null=True)
    title = models.CharField(max_length=200, help_text="Enter the name of the book")
    author = models.CharField(max_length=200, help_text="Enter the name of the book's author")
    genre = models.CharField(max_length=30, help_text="Enter the genre of the book")
    language = models.CharField(max_length=20, help_text="Enter the language of the book")
    pages = models.IntegerField(help_text="Enter number of pages in the book")
    year = models.IntegerField(help_text="Enter the year of publishing of the book")
    description = models.TextField(help_text="Enter the description of the book")

    def __str__(self):
        return f"{self.title}"

    def get_absolute_url(self):
        return reverse('book-details', kwargs={'pk': self.itemID})


class Request(models.Model):
    requestID = models.AutoField(primary_key=True)
    sender_book = models.ForeignKey(BookItem, on_delete=models.CASCADE, related_name='sender_book')
    receiver_book = models.ForeignKey(BookItem, on_delete=models.CASCADE, related_name='receiver_book')
    status = models.CharField(max_length=1, default='p')
    sending_time = models.DateTimeField(default=datetime.now)
    approval_time = models.DateTimeField(null=True)
    deletion_time = models.DateTimeField(null=True)

    def __str__(self):
        return f"{self.requestID}"
