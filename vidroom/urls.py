"""vidroom URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.render_index, name='home'),
    url(r'^vidroom/(?P<vidroom_id>.+)/playlist/move$', views.register_playlist_reorder, name='vidroom_playlist_reorder'),
    url(r'^vidroom/(?P<vidroom_id>.+)/playlist/add$', views.register_playlist_add, name='vidroom_playlist_add'),
    url(r'^vidroom/(?P<vidroom_id>.+)/playlist/remove$', views.register_playlist_remove, name='vidroom_playlist_remove'),
    url(r'^vidroom/(?P<vidroom_id>.+)/event/log$', views.register_vidroom_event, name='vidroom_event_log'),
    url(r'^vidroom/(?P<vidroom_id>.+)/status$', views.return_vidroom_status, name='vidroom_status_query'),
    url(r'^vidroom/(?P<vidroom_id>.+)$', views.render_vidroom, name='vidroom'),
    url(r'^vidroom/$', views.get_new_vidroom, name='new_vidroom_redirect')
]
