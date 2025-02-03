from rest_framework import serializers
from .models import ÄnderungsBlog

class ÄnderungsBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ÄnderungsBlog
        fields = ['id', 'entität', 'typ', 'gueltigkeit', 'aenderung', 'zeitpunkt', 'geaendert_von']
