# Generated by Django 2.2.8 on 2020-02-09 12:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_shopbilling_imp_uid'),
    ]

    operations = [
        migrations.AddField(
            model_name='shopbilling',
            name='merchant_uid',
            field=models.CharField(default='', max_length=100),
            preserve_default=False,
        ),
    ]