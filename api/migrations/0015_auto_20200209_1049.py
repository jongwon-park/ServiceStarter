# Generated by Django 2.2.8 on 2020-02-09 10:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20200209_1041'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shopbilling',
            name='next_pay',
        ),
        migrations.AddField(
            model_name='shopbilling',
            name='scheduled',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='shopbilling',
            name='expired',
            field=models.DateTimeField(),
        ),
    ]