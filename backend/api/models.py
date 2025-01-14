# models.py
from django.db import models

"""
class Struktur(models.Model):
    struktur_id = models.AutoField(primary_key=True)  # Primary Key with Auto-Increment
    name = models.CharField(max_length=20)
    child_id = models.IntegerField(null=True, blank=True)  # Plain integer field
    parent = models.IntegerField(null=True, blank=True)    # Plain integer field

    def __str__(self):
        return self.name
"""

from django.db import models

class abc(models.Model):
    id = models.AutoField(primary_key=True)  # Auto incrementing primary key
    primaerteam_id = models.IntegerField()  # Integer field for primary team ID
    team_id = models.IntegerField()  # Integer field for team ID
    personen_id = models.IntegerField()  # Integer field for person ID
    provisionssatz = models.DecimalField(max_digits=6, decimal_places=4)  # Decimal field for provisions rate
    anteil = models.IntegerField()  # Integer field for share

    def __str__(self):
        return f"ID: {self.id} - Team: {self.team_id}"
    
class teamschlüssel(models.Model):
    id = models.AutoField(primary_key=True)  # Auto incrementing primary key
    primaerteam_id = models.IntegerField()  # Integer field for primary team ID
    team_id = models.IntegerField()  # Integer field for team ID
    personen_id = models.IntegerField()  # Integer field for person ID
    
    class Meta:
        db_table = 'teamschlüssel'

from django.db import models

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


class MonatsdatenTeams(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
    primaerteam_id = models.IntegerField()
    umsatzplan = models.IntegerField()
    umsatz = models.IntegerField()
    db_plan = models.DecimalField(max_digits=6, decimal_places=4)
    db_ist = models.DecimalField(max_digits=6, decimal_places=4)
    teamanpassung = models.IntegerField()

    class Meta:
        db_table = 'monatsdaten_teams'
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
        managed = False

class Folder(models.Model):
    bezeichnung = models.TextField()
    notiz = models.TextField()

    class Meta:
        db_table = 'ordner_stammdaten'
        managed = False

class Primary(models.Model):
    bezeichnung = models.TextField()
    sortierfeld = models.IntegerField()
    notiz = models.TextField()

    class Meta:
        db_table = 'primärteam_stammdaten'
        managed = False

class Team(models.Model):
    bezeichnung = models.TextField()
    notiz = models.TextField()
    anteile = models.IntegerField()
    anteile_verbergen = models.BooleanField()

    class Meta:
        db_table = 'team_stammdaten'


class MonatsdatenTeams(models.Model):
    jahr_und_monat = models.DateField(primary_key=True)
    primaerteam_id = models.IntegerField(null = False, blank = False)
    umsatz_plan = models.IntegerField(null=True, blank=True)
    umsatz = models.IntegerField(null=True, blank=True)
    db_plan = models.DecimalField(max_digits=6, decimal_places=4, null=True, blank=True)
    db_ist = models.DecimalField(max_digits=6, decimal_places=4, null=True, blank=True)
    teamanpassung = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'monatsdaten_teams'
        #unique_together = ('jahr_und_monat', 'primaerteam_id')
        constraints = [
            models.UniqueConstraint(fields=['jahr_und_monat', 'primaerteam_id'], name='monatsdaten_teams_pk')
        ]

class MonatsdatenPersonen(models.Model):
    jahr_und_monat = models.DateField(primary_key=True)
    mitarbeiter_id = models.IntegerField(null = False, blank = False)
    festbetrag = models.DecimalField(max_digits=6, decimal_places=4, null=True, blank=True)
    fixum = models.DecimalField(max_digits=6, decimal_places=4, null=True, blank=True)
    fehltage = models.IntegerField(null=True, blank=True)
    teiler = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'monatsdaten_personen'
        #unique_together = ('jahr_und_monat', 'mitarbeiter_id')
        constraints = [
            models.UniqueConstraint(fields=['jahr_und_monat', 'mitarbeiter_id'], name='monatsdaten_personen_pk')
        ]
