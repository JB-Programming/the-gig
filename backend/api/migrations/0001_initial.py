# Generated by Django 5.1.2 on 2024-11-27 16:24

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mitarbeiter_aktiv', models.BooleanField(blank=True, null=True)),
                ('login_gesperrt', models.BooleanField(blank=True, null=True)),
                ('vorname', models.TextField(blank=True, null=True)),
                ('nachname', models.TextField(blank=True, null=True)),
                ('zusatz', models.TextField(blank=True, null=True)),
                ('bemerkung', models.TextField(blank=True, null=True)),
                ('standort', models.TextField(blank=True, null=True)),
                ('beginn_betriebszugehoerigkeit', models.DateField(blank=True, null=True)),
                ('ende_betriebszugehoerigkeit', models.DateField(blank=True, null=True)),
                ('startbetrag_konto', models.DecimalField(blank=True, decimal_places=2, max_digits=15, null=True)),
                ('daten_bmg', models.BooleanField(blank=True, null=True)),
                ('spalte_gehalt', models.BooleanField(blank=True, null=True)),
                ('spalte_festbetrag', models.BooleanField(blank=True, null=True)),
            ],
            options={
                'db_table': 'mitarbeiter_stammdaten',
            },
        ),
        migrations.CreateModel(
            name='Folder',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bezeichnung', models.TextField()),
                ('notiz', models.TextField()),
            ],
            options={
                'db_table': 'ordner_stammdaten',
            },
        ),
        migrations.CreateModel(
            name='Primary',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bezeichnung', models.TextField()),
                ('sortierfeld', models.IntegerField()),
                ('notiz', models.TextField()),
            ],
            options={
                'db_table': 'primärteam_stammdaten',
            },
        ),
        migrations.CreateModel(
            name='Primär',
            fields=[
                ('primär_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=80)),
            ],
        ),
        migrations.CreateModel(
            name='Struktur',
            fields=[
                ('struktur_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=80)),
                ('parent', models.JSONField(blank=True, null=True)),
                ('primär_id', models.IntegerField(blank=True, null=True)),
                ('ordner_id', models.IntegerField(blank=True, null=True)),
                ('team_id', models.IntegerField(blank=True, null=True)),
                ('mitarbeiter_id', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'struktur',
            },
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('bezeichnung', models.TextField()),
                ('notiz', models.TextField()),
                ('anteile', models.IntegerField()),
                ('anteile_verbergen', models.BooleanField()),
            ],
            options={
                'db_table': 'team_stammdaten',
            },
        ),
    ]
