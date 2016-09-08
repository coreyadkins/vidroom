"""vidroom Admin Configuration."""

from django.contrib import admin

from . import models

admin.site.register(models.VidRoom)
admin.site.register(models.Event)
