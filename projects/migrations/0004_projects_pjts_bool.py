# Generated by Django 2.1.7 on 2019-04-18 19:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0003_projects_pjts_hash'),
    ]

    operations = [
        migrations.AddField(
            model_name='projects',
            name='pjts_bool',
            field=models.NullBooleanField(default=False),
        ),
    ]
