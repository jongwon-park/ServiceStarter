# Generated by Django 2.2.8 on 2020-02-11 14:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_chatmessage_chatroom'),
    ]

    operations = [
        migrations.CreateModel(
            name='TaskWork',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('progress', models.IntegerField(default=0)),
                ('status', models.CharField(max_length=100)),
                ('body', models.TextField(blank=True, null=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Profile')),
            ],
        ),
    ]
