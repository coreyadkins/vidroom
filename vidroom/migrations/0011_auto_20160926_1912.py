# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-26 19:12
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vidroom', '0010_auto_20160914_1718'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='playlistentry',
            name='url',
        ),
        migrations.AddField(
            model_name='playlistentry',
            name='video_id',
            field=models.TextField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='vidroom',
            name='public_id',
            field=models.TextField(default='<function uuid4 at 0x7f66e83cbe18>'),
        ),
    ]
