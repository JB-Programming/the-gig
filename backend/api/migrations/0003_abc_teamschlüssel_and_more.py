# Generated by Django 5.1.3 on 2024-11-17 13:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_rename_structure_struktur_alter_struktur_table'),
    ]

    operations = [
        migrations.CreateModel(
            name='abc',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('primaerteam_id', models.IntegerField()),
                ('team_id', models.IntegerField()),
                ('personen_id', models.IntegerField()),
                ('provisionssatz', models.DecimalField(decimal_places=4, max_digits=6)),
                ('anteil', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='teamschlüssel',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('primaerteam_id', models.IntegerField()),
                ('team_id', models.IntegerField()),
                ('personen_id', models.IntegerField()),
            ],
            options={
                'db_table': 'teamschlüssel',
            },
        ),
        migrations.RenameField(
            model_name='struktur',
            old_name='child_id',
            new_name='mitarbeiter_id',
        ),
        migrations.AddField(
            model_name='struktur',
            name='ordner_id',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='struktur',
            name='primär_id',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='struktur',
            name='team_id',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='struktur',
            name='name',
            field=models.CharField(max_length=80),
        ),
        migrations.AlterModelTable(
            name='struktur',
            table='struktur',
        ),
    ]
