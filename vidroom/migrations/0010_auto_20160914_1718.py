# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-14 17:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vidroom', '0009_auto_20160913_2220'),
    ]

    operations = [
        migrations.AlterField(
            model_name='playlistentry',
            name='position',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='vidroom',
            name='public_id',
            field=models.TextField(default='<function uuid4 at 0x7f55df4e5e18>'),
        ),
    ]