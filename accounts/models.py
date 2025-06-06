from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
import os 
from PIL import Image
# Create your models here.
 

class User(AbstractUser):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'username', 'last_name']
    def get_full_name(self):
        return self.first_name + " " + self.last_name
    def get_initials(self):
        return f'{self.first_name[:1]}{self.last_name[:1]}'.upper()
    
class UserProfile(models.Model):
    TIMEZONE_CHOICES = [
        ('UTC','UTC'),
        ('Europe/Moscow',"Москва"),
        ('America/New_York', 'Нью-Йорк')
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png'])])
    job_title = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    timezone = models.CharField(max_length=50, choices=TIMEZONE_CHOICES, default='UTC')
    email_notifications = models.BooleanField(default=True)
    task_notifications = models.BooleanField(default=True)
    comment_notifications = models.BooleanField(default = True)
    language = models.CharField(max_length=20, default='ru')

    def __str__(self):
        return self.user.get_full_name()
    
    def set_avatar(self):
        img = Image.open(self.avatar.path)
        if img.height >300 or img.width > 300:
            output_size = (300,300)
            img.thumbnail(output_size)
            img.save(self.avatar.path)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.avatar:
            self.set_avatar()
