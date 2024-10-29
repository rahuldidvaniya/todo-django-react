from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from django.db import connection, DatabaseError
from .serializers import ProjectSerializer, TodoSerializer
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

class ProjectCreateView(APIView):
    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            description = serializer.validated_data.get('description', '')

            try:
                with connection.cursor() as cursor:
                    cursor.callproc('add_project', [name, description])
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except DatabaseError as e:
                logger.error(f"Database error occurred while adding a project: {e}")
                return Response({"detail": "Database error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                logger.error(f"An unexpected error occurred: {e}")
                return Response({"detail": "An unexpected error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            logger.warning(f"Validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Changed status code to 400_BAD_REQUEST for validation errors

class ProjectListView(APIView):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM list_projects()")
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]
            projects = [dict(zip(columns, row)) for row in rows]
        return Response(projects, status=status.HTTP_200_OK)

class TodoCreateView(APIView):
    def post(self, request):
        serializer = TodoSerializer(data=request.data)
        if serializer.is_valid():
            project_id = serializer.validated_data['project_id']
            title = serializer.validated_data['title']
            description = serializer.validated_data['description']
            priority = serializer.validated_data['priority']
            due_date = serializer.validated_data['due_date']
            try:
                with connection.cursor() as cursor:
                    cursor.callproc('add_todo', [project_id, title, description, priority, due_date])
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except DatabaseError as e:
                logger.error(f"Database error occurred while adding a todo: {e}")  # Corrected the error message
                return Response({"detail": "Database error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                logger.error(f"An unexpected error occurred: {e}")
                return Response({"detail": "An unexpected error occurred. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            logger.warning(f'Validation failed: {serializer.errors}')
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Changed status code to 400_BAD_REQUEST for validation errors

class TodoListView(APIView):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM get_all_todos()")
            rows = cursor.fetchall()
            columns = [col[0] for col in cursor.description]
            todos = [dict(zip(columns, row)) for row in rows]  # Changed variable name to todos for clarity
            return Response(todos, status=status.HTTP_200_OK)




class TodoDeleteView(APIView):
    def delete(self, request, id):
        try:
            with connection.cursor() as cursor:
                cursor.callproc('delete_todo', [id])
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

