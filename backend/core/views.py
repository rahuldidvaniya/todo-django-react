"""
Core views for project and todo management.
Contains API views for CRUD operations on projects and todos using stored procedures.
"""

# Standard library imports
import logging

# Django imports
from django.db import connection, DatabaseError
from django.shortcuts import render

# Third party imports
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

# Local imports
from .serializers import ProjectSerializer, TodoSerializer

# Configure logging
logger = logging.getLogger(__name__)


class ProjectCreateView(APIView):
    """
    API view to create a new project.
    
    Accepts POST requests with project details and creates a new project
    using the add_project stored procedure.
    """
    
    def post(self, request):
        """
        Handle POST request to create a project.
        
        Args:
            request: HTTP request object containing project data
            
        Returns:
            Response with created project data or error details
        """
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            description = serializer.validated_data.get('description', '')

            try:
                with connection.cursor() as cursor:
                    cursor.callproc('add_project', [name, description])
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
            except DatabaseError as db_error:
                logger.error(f"Database error creating project: {db_error}")
                return Response(
                    {"detail": "Database error occurred. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            except Exception as error:
                logger.error(f"Unexpected error creating project: {error}")
                return Response(
                    {"detail": "An unexpected error occurred. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        
        logger.warning(f"Project validation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectListView(APIView):
    """API view to list all projects."""
    
    def get(self, request):
        """
        Handle GET request to list all projects.
        
        Args:
            request: HTTP request object
            
        Returns:
            Response containing list of all projects
        """
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM list_projects()")
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                projects = [dict(zip(columns, row)) for row in rows]
            return Response(projects, status=status.HTTP_200_OK)
            
        except DatabaseError as error:
            logger.error(f"Database error fetching projects: {error}")
            return Response(
                {"detail": "Error retrieving projects."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TodoCreateView(APIView):
    """API view to create a new todo item."""
    
    def post(self, request):
        """
        Handle POST request to create a todo item.
        
        Args:
            request: HTTP request object containing todo data
            
        Returns:
            Response with created todo data or error details
        """
        serializer = TodoSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with connection.cursor() as cursor:
                    cursor.callproc('add_todo', [
                        serializer.validated_data['project_id'],
                        serializer.validated_data['title'],
                        serializer.validated_data['description'],
                        serializer.validated_data['priority'],
                        serializer.validated_data['due_date']
                    ])
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
            except DatabaseError as db_error:
                logger.error(f"Database error creating todo: {db_error}")
                return Response(
                    {"detail": "Database error occurred. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            except Exception as error:
                logger.error(f"Unexpected error creating todo: {error}")
                return Response(
                    {"detail": "An unexpected error occurred. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        logger.warning(f"Todo validation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TodoListView(APIView):
    """API view to list all todo items."""
    
    def get(self, request):
        """
        Handle GET request to list all todos.
        
        Args:
            request: HTTP request object
            
        Returns:
            Response containing list of all todos
        """
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM get_all_todos()")
                rows = cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                todo_items = [dict(zip(columns, row)) for row in rows]
            return Response(todo_items, status=status.HTTP_200_OK)
            
        except DatabaseError as error:
            logger.error(f"Database error fetching todos: {error}")
            return Response(
                {"detail": "Error retrieving todos."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class TodoDeleteView(APIView):
    """API view to delete a todo item."""
    
    def delete(self, request, id):
        """
        Handle DELETE request to remove a todo item.
        
        Args:
            request: HTTP request object
            id: ID of todo to delete
            
        Returns:
            Response indicating success or error
        """
        try:
            with connection.cursor() as cursor:
                cursor.callproc('delete_todo', [id])
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except DatabaseError as error:
            logger.error(f"Database error deleting todo {id}: {error}")
            return Response(
                {"detail": f"Error deleting todo {id}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProjectDeleteView(APIView):
    """API view to delete a project."""
    
    def delete(self, request, id):
        """
        Handle DELETE request to remove a project.
        
        Args:
            request: HTTP request object
            id: ID of project to delete
            
        Returns:
            Response indicating success or error
        """
        try:
            with connection.cursor() as cursor:
                cursor.callproc('delete_project', [id])
            return Response(status=status.HTTP_204_NO_CONTENT)
            
        except DatabaseError as error:
            logger.error(f"Database error deleting project {id}: {error}")
            return Response(
                {"detail": f"Error deleting project {id}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ToggleTodoCompleted(APIView):
    """API view to toggle completion status of a todo item."""

    def put(self, request, id):
        """
        Handle PUT request to toggle todo completion status.
        
        Args:
            request: HTTP request object
            id: ID of todo to toggle
            
        Returns:
            Response indicating success or error
        """
        if not isinstance(id, int) or id <= 0:
            return Response(
                {"detail": "Invalid todo ID."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not self._todo_exists(id):
            return Response(
                {"detail": "Todo not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            with connection.cursor() as cursor:
                cursor.callproc('toggle_todo_completion', [id])
            return Response(
                {"detail": "Todo status updated successfully."},
                status=status.HTTP_200_OK
            )
            
        except DatabaseError as db_error:
            logger.error(f"Database error toggling todo {id}: {db_error}")
            return Response(
                {"detail": "Database error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as error:
            logger.error(f"Unexpected error toggling todo {id}: {error}")
            return Response(
                {"detail": "An unexpected error occurred. Please try again later."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _todo_exists(self, id):
        """
        Check if a todo item exists.
        
        Args:
            id: ID of todo to check
            
        Returns:
            bool: True if todo exists, False otherwise
        """
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT EXISTS (SELECT 1 FROM public.todos WHERE id = %s)",
                [id]
            )
            return cursor.fetchone()[0]


class EditProject(APIView):
    """API view to edit project details."""
    
    def patch(self, request, id):
        """
        Handle PATCH request to update project details.
        
        Args:
            request: HTTP request object containing updated project data
            id: ID of project to update
            
        Returns:
            Response with updated project data or error details
        """
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            name = serializer.validated_data['name']
            description = serializer.validated_data.get('description', '')

            try:
                with connection.cursor() as cursor:
                    cursor.callproc('edit_project', [id, name, description])
                return Response(serializer.data, status=status.HTTP_200_OK)
                
            except DatabaseError as db_error:
                logger.error(f"Database error updating project {id}: {db_error}")
                return Response(
                    {"detail": "Database error occurred. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            except Exception as error:
                logger.error(f"Unexpected error updating project {id}: {error}")
                return Response(
                    {"detail": "An unexpected error occurred. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        logger.warning(f"Project update validation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EditTodo(APIView):
    """API view to edit todo details."""
    
    def patch(self, request, id):
        serializer = TodoSerializer(data=request.data)
        if serializer.is_valid():
            title = serializer.validated_data['title']
            description = serializer.validated_data.get('description', '')
            priority = serializer.validated_data['priority']
            due_date = serializer.validated_data['due_date']

            try:
                with connection.cursor() as cursor:
                    cursor.callproc('edit_todo', [id, title, description, priority, due_date])
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            except DatabaseError as db_error:
                logger.error(f"Database error updating todo {id}: {db_error}")
                return Response(
                    {"detail": "Database error occurred. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            except Exception as error:
                logger.error(f"Unexpected error updating todo {id}: {error}")
                return Response(
                    {"detail": "An unexpected error occurred. Please try again later."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        logger.warning(f"Todo update validation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
