from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import authenticate
from .models import User, UserProfile


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password1', 'password2')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'class': 'form__input',
            'placeholder': 'Имя пользователя'
        })
        self.fields['email'].widget.attrs.update({
            'class': 'form__input',
            'placeholder': 'Email'
        })
        self.fields['first_name'].widget.attrs.update({
            'class': 'form__input',
            'placeholder': 'Имя'
        })
        self.fields['last_name'].widget.attrs.update({
            'class': 'form__input',
            'placeholder': 'Фамилия'
        })
        self.fields['password1'].widget.attrs.update({
            'class': 'form__input',
            'placeholder': 'Пароль'
        })
        self.fields['password2'].widget.attrs.update({
            'class': 'form__input',
            'placeholder': 'Подтверждение пароля'
        })
    
    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
            # Создаем профиль пользователя
            UserProfile.objects.create(user=user)
        return user

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(widget=forms.EmailInput(attrs={
        'class': 'form__input',
        'placeholder': 'Email',
        'autofocus': True
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form__input',
        'placeholder': 'Пароль'
    }))
    
    def clean(self):
        email = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        
        if email and password:
            self.user_cache = authenticate(
                self.request,
                username=email,
                password=password
            )
            if self.user_cache is None:
                raise forms.ValidationError('Неверный email или пароль')
            else:
                self.confirm_login_allowed(self.user_cache)
        
        return self.cleaned_data

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(widget=forms.EmailInput(attrs={
        'class': 'form__input',
        'placeholder': 'Email',
        'autofocus': True
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form__input',
        'placeholder': 'Пароль'
    }))
    
    def clean(self):
        email = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        
        if email and password:
            self.user_cache = authenticate(
                self.request,
                username=email,
                password=password
            )
            if self.user_cache is None:
                raise forms.ValidationError('Неверный email или пароль')
            else:
                self.confirm_login_allowed(self.user_cache)
        
        return self.cleaned_data
    
class UserProfileForm(forms.ModelForm):
    first_name = forms.CharField(max_length=30, required=True)
    last_name = forms.CharField(max_length=30, required=True)
    email = forms.EmailField(required=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'avatar', 'job_title', 'phone', 'timezone', 'email_notifications',
            'task_notifications', 'comment_notifications', 
        ]
        widgets = {
            'avatar': forms.FileInput(attrs={'accept': 'image/*', 'class': 'form__file-input'})
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.user:
            self.fields['first_name'].initial = self.instance.user.first_name
            self.fields['last_name'].initial = self.instance.user.last_name
            self.fields['email'].initial = self.instance.user.email
        
        # Применяем стили к полям
        for field_name, field in self.fields.items():
            if field_name not in ['email_notifications', 'task_notifications', 
                                'comment_notifications', 'avatar']:
                field.widget.attrs.update({'class': 'form__input'})
            elif field_name in ['email_notifications', 'task_notifications', 
                              'comment_notifications']:
                field.widget.attrs.update({'class': 'form__checkbox'})
    def save(self, commit=True):
        profile = super().save(commit=False)
        
        # Обновляем данные пользователя
        profile.user.first_name = self.cleaned_data['first_name']
        profile.user.last_name = self.cleaned_data['last_name']
        profile.user.email = self.cleaned_data['email']
       
        if commit:
            profile.user.save()
            profile.save()
       
        return profile