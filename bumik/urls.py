from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView, TemplateView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # Main app redirects
    path('', RedirectView.as_view(url='/dashboard/', permanent=False), name='home'),
    
    # Apps
    path('accounts/', include('accounts.urls')),
    path('dashboard/', TemplateView.as_view(template_name='base.html'), name='dashboard'),
    # path('projects/', include('projects.urls')),
    # path('boards/', include('boards.urls')),
    # path('tasks/', include('tasks.urls')),
    # path('api/', include('api.urls')),
]

# Media files (only in development)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin site customization
admin.site.site_header = "ProjectManager Admin"
admin.site.site_title = "ProjectManager"
admin.site.index_title = "Добро пожаловать в панель управления"