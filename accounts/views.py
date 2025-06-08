from django.shortcuts import render, redirect
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.contrib import messages
from django.urls import reverse_lazy
from django.views.generic import CreateView
from .forms import CustomUserCreationForm, CustomAuthenticationForm, UserProfileForm
from .models import User, UserProfile


class CustomLoginView(LoginView):
    form_class = CustomAuthenticationForm
    template_name = 'accounts/login.html'
    success_url = reverse_lazy('dashboard')
    redirect_authenticated_user = True
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Вход в аккаунт'
        return context
    
    def form_valid(self, form):
        messages.success(self.request, f'Добро пожаловать, {form.get_user().get_full_name()}!')
        return super().form_valid(form)


class RegisterView(CreateView):
    form_class = CustomUserCreationForm
    template_name = 'accounts/register.html'
    success_url = reverse_lazy('dashboard')
    
    def form_valid(self, form):
        response = super().form_valid(form)
        login(self.request, self.object)
        messages.success(self.request, 'Добро пожаловать! Ваш аккаунт создан.')
        return response
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Регистрация'
        return context


@login_required
def profile_view(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    return render(request, 'accounts/profile.html', {
        'profile': profile,
        'title': 'Мой профиль'
    })


@login_required
def edit_profile_view(request):
    profile, created = UserProfile.objects.get_or_create(user=request.user)
    
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Профиль успешно обновлен!')
            return redirect('profile')
        else:
            messages.error(request, 'Пожалуйста, исправьте ошибки в форме.')
    else:
        form = UserProfileForm(instance=profile)
    
    return render(request, 'accounts/edit_profile.html', {
        'form': form,
        'profile': profile,
        'title': 'Редактирование профиля'
    })


def logout_view(request):
    user_name = request.user.get_full_name() if request.user.is_authenticated else None
    logout(request)
    if user_name:
        messages.info(request, f'До свидания, {user_name}!')
    else:
        messages.info(request, 'Вы успешно вышли из аккаунта.')
    return redirect('login')