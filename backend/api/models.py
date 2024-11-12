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
    parent = models.IntegerField(null=True, blank=True)         # Non-foreign key for parent (could be an ID or reference to a different structure)
    primär_id = models.IntegerField(null=True, blank=True)  # Foreign Key for Primar
    ordner_id = models.IntegerField(null=True, blank=True)  # Foreign Key for Ordner
    team_id = models.IntegerField(null=True, blank=True)  # Foreign Key for Team
    mitarbeiter_id = models.IntegerField(null=True, blank=True)  # Foreign Key for Mitarbeiter

    class Meta:
        db_table = 'struktur'


