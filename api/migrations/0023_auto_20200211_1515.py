# Generated by Django 2.2.8 on 2020-02-11 15:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0022_taskwork_channel_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='taskwork',
            name='channel_name',
        ),
        migrations.CreateModel(
            name='TaskClient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('channel_name', models.CharField(max_length=100)),
                ('work', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.TaskWork')),
            ],
        ),
    ]
