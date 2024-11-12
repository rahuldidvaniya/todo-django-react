from rest_framework import serializers
from .models import Project, Todo

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        extra_kwargs = {
            'name': {'required': True},
            'description': {'required': False}
        }

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'
        extra_kwargs = {
            'project_id': {'required': True},
            'title': {'required': True},
            'description': {'required': False},
            'priority': {'required': True},
            'due_date': {'required': True}
        }
        
