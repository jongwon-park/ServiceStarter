# Generated by Django 2.2.8 on 2020-02-06 04:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_boarditem_valid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='boarditem',
            name='content',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='boarditem',
            name='title',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
