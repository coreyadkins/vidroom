# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-13 22:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vidroom', '0008_auto_20160912_2301'),
    ]

    operations = [
        migrations.RenameField(
            model_name='playlistentry',
            old_name='order',
            new_name='position',
        ),
        migrations.AlterField(
            model_name='vidroom',
            name='public_id',
            field=models.TextField(default='<function uuid4 at 0x7fe6395c4e18>'),
        ),
    ]
