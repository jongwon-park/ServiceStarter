# Generated by Django 2.2.8 on 2020-02-08 05:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20200208_0519'),
    ]

    operations = [
        migrations.AddField(
            model_name='boardgroup',
            name='readonly',
            field=models.BooleanField(default=False),
        ),
    ]
