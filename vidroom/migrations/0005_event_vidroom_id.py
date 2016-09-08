# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-08 19:09
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vidroom', '0004_auto_20160907_1935'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='vidroom_id',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='vidroom.VidRoom'),
            preserve_default=False,
        ),
    ]
