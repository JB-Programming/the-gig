from django.db import models

# Create your models here.
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