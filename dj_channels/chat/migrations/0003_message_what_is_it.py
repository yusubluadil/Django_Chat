# Generated by Django 4.1.1 on 2022-10-01 19:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_room_first_user_room_second_user_delete_chatuser'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='what_is_it',
            field=models.CharField(max_length=50, null=True),
        ),
    ]
