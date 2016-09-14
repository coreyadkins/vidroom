# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-12 23:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vidroom', '0007_auto_20160912_1746'),
    ]

    operations = [
        migrations.AddField(
            model_name='playlistentry',
            name='order',
            field=models.IntegerField(default=1),
        ),
        migrations.AlterField(
            model_name='vidroom',
            name='public_id',
            field=models.TextField(default='<function uuid4 at 0x7f205bd7fe18>'),
        ),
    ]