# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-09 17:27
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vidroom', '0002_auto_20160908_2301'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='timestamp',
        ),
        migrations.AlterField(
            model_name='vidroom',
            name='public_id',
            field=models.TextField(default='<function uuid4 at 0x7f81e66c3e18>'),
        ),
    ]