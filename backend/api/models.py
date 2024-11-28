from django.db import models

# Create your models here.
class Struktur(models.Model):
    struktur_id = models.AutoField(primary_key=True)           # Primary Key with Auto Increment
    name = models.CharField(max_length=80)                     # Name field with max length of 80 characters
    parent = models.JSONField(null=True, blank=True)         # Non-foreign key for parent (could be an ID or reference to a different structure)
    primär_id = models.IntegerField(null=True, blank=True)  # Foreign Key for Primar
    ordner_id = models.IntegerField(null=True, blank=True)  # Foreign Key for Ordner
    team_id = models.IntegerField(null=True, blank=True)  # Foreign Key for Team
    mitarbeiter_id = models.IntegerField(null=True, blank=True)  # Foreign Key for Mitarbeiter

    class Meta:
        db_table = 'struktur'

class Primär(models.Model):
    primär_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=80)


class Employee(models.Model):
    mitarbeiter_aktiv = models.BooleanField(null=True, blank=True)
    login_gesperrt = models.BooleanField(null=True, blank=True)
    vorname = models.TextField(null=True, blank=True)
    nachname = models.TextField(null=True, blank=True)
    zusatz = models.TextField(null=True, blank=True)
    bemerkung = models.TextField(null=True, blank=True)
    standort = models.TextField(null=True, blank=True)
    beginn_betriebszugehoerigkeit = models.DateField(null=True, blank=True)
    ende_betriebszugehoerigkeit = models.DateField(null=True, blank=True)
    startbetrag_konto = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    daten_bmg = models.BooleanField(null=True, blank=True)
    spalte_gehalt = models.BooleanField(null=True, blank=True)
    spalte_festbetrag = models.BooleanField(null=True, blank=True)

    class Meta:
        db_table = 'mitarbeiter_stammdaten'

class Folder(models.Model):
    bezeichnung = models.TextField()
    notiz = models.TextField()

    class Meta:
        db_table = 'ordner_stammdaten'

class Primary(models.Model):
    bezeichnung = models.TextField()
    sortierfeld = models.IntegerField()
    notiz = models.TextField()

    class Meta:
        db_table = 'primärteam_stammdaten'

class Team(models.Model):
    bezeichnung = models.TextField()
    notiz = models.TextField()
    anteile = models.IntegerField()
    anteile_verbergen = models.BooleanField()

    class Meta:
        db_table = 'team_stammdaten'
