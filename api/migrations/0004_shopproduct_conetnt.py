# Generated by Django 2.2.8 on 2020-02-08 05:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_boardgroup_readonly'),
    ]

    operations = [
        migrations.AddField(
            model_name='shopproduct',
            name='conetnt',
            field=models.TextField(blank=True, null=True),
        ),
    ]