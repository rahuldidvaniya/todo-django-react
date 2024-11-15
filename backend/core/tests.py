from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from datetime import date
from django.db import DatabaseError
from unittest.mock import patch, MagicMock
from .models import Project, Todo

class ProjectCreateViewTests(APITestCase):
    def test_create_project_success(self):
        """Test successful project creation"""
        url = reverse('create-project')
        data = {
            'name': 'Test Project',
            'description': 'Test Description'
        }
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor.return_value.__enter__.return_value.callproc.return_value = None
            response = self.client.post(url, data, format='json')
            
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Test Project')
        
    def test_create_project_invalid_data(self):
        """Test project creation with invalid data"""
        url = reverse('create-project')
        data = {'description': 'Missing name field'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_create_project_database_error(self):
        """Test project creation with database error"""
        url = reverse('create-project')
        data = {
            'name': 'Test Project',
            'description': 'Test Description'
        }
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor.return_value.__enter__.return_value.callproc.side_effect = DatabaseError
            response = self.client.post(url, data, format='json')
            
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def test_create_project_unexpected_error(self):
        """Test project creation with unexpected error"""
        url = reverse('create-project')
        data = {
            'name': 'Test Project',
            'description': 'Test Description'
        }
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor.return_value.__enter__.return_value.callproc.side_effect = Exception("Unexpected error")
            response = self.client.post(url, data, format='json')
            
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data['detail'], "An unexpected error occurred. Please try again later.")

class ProjectListViewTests(APITestCase):
    def test_list_projects_success(self):
        """Test successful project listing"""
        url = reverse('projects')
        mock_projects = [(1, 'Project 1', 'Desc 1'), (2, 'Project 2', 'Desc 2')]
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor_cm = mock_cursor.return_value.__enter__.return_value
            mock_cursor_cm.fetchall.return_value = mock_projects
            mock_cursor_cm.description = [('id',), ('name',), ('description',)]
            response = self.client.get(url)
            
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
    def test_list_projects_database_error(self):
        """Test project listing with database error"""
        url = reverse('projects')
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor.return_value.__enter__.return_value.execute.side_effect = DatabaseError
            response = self.client.get(url)
            
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def test_list_projects_empty(self):
        """Test project listing with no projects"""
        url = reverse('projects')
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor_cm = mock_cursor.return_value.__enter__.return_value
            mock_cursor_cm.rowcount = 0
            response = self.client.get(url)
            
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

class TodoCreateViewTests(APITestCase):
    def test_create_todo_success(self):
        """Test successful todo creation"""
        url = reverse('create-todos')
        data = {
            'project_id': 1,
            'title': 'Test Todo',
            'description': 'Test Description',
            'priority': 'medium',
            'due_date': '2024-03-20'
        }
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor.return_value.__enter__.return_value.callproc.return_value = None
            response = self.client.post(url, data, format='json')
            
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_create_todo_invalid_data(self):
        """Test todo creation with invalid data"""
        url = reverse('create-todos')
        data = {'title': 'Missing required fields'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class TodoListViewTests(APITestCase):
    def test_list_todos_success(self):
        """Test successful todo listing"""
        url = reverse('todos')
        mock_todos = [(1, 'Todo 1', 'Desc 1', 'high', '2024-03-20', False)]
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor_cm = mock_cursor.return_value.__enter__.return_value
            mock_cursor_cm.fetchall.return_value = mock_todos
            mock_cursor_cm.description = [('id',), ('title',), ('description',), 
                                        ('priority',), ('due_date',), ('is_completed',)]
            response = self.client.get(url)
            
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class TodoDeleteViewTests(APITestCase):
    def test_delete_todo_success(self):
        """Test successful todo deletion"""
        url = reverse('delete-todo', args=[1])
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor.return_value.__enter__.return_value.callproc.return_value = None
            response = self.client.delete(url)
            
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
    def test_delete_todo_database_error(self):
        """Test todo deletion with database error"""
        url = reverse('delete-todo', args=[1])
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor.return_value.__enter__.return_value.callproc.side_effect = DatabaseError
            response = self.client.delete(url)
            
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_delete_nonexistent_todo(self):
        """Test deletion of non-existent todo"""
        url = reverse('delete-todo', args=[999])
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor_cm = mock_cursor.return_value.__enter__.return_value
            mock_cursor_cm.fetchone.return_value = [False]
            response = self.client.delete(url)
            
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], "Todo not found")

class ToggleTodoCompletedTests(APITestCase):
    def setUp(self):
        self.todo_id = 1
        self.url = reverse('toggle-completed', args=[self.todo_id])

    @patch('django.db.connection.cursor')
    def test_toggle_todo_success(self, mock_cursor):
        """Test successful todo toggle"""
        mock_cursor.return_value.__enter__.return_value.fetchone.return_value = [True]
        mock_cursor.return_value.__enter__.return_value.callproc.return_value = None
        
        response = self.client.put(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_toggle_todo_invalid_id(self):
        """Test toggle with invalid todo ID"""
        url = reverse('toggle-completed', args=[0])
        response = self.client.put(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    @patch('django.db.connection.cursor')
    def test_toggle_todo_not_found(self, mock_cursor):
        """Test toggle with non-existent todo"""
        mock_cursor.return_value.__enter__.return_value.fetchone.return_value = [False]
        
        response = self.client.put(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class EditProjectTests(APITestCase):
    def test_edit_project_success(self):
        """Test successful project edit"""
        url = reverse('edit-project', args=[1])
        data = {
            'name': 'Updated Project',
            'description': 'Updated Description'
        }
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor_cm = mock_cursor.return_value.__enter__.return_value
            mock_cursor_cm.fetchone.return_value = [True]
            mock_cursor_cm.callproc.return_value = None
            response = self.client.patch(url, data, format='json')
            
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_edit_project_invalid_data(self):
        """Test project edit with invalid data"""
        url = reverse('edit-project', args=[1])
        data = {'description': 'Missing name field'}
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor_cm = mock_cursor.return_value.__enter__.return_value
            mock_cursor_cm.fetchone.return_value = [True]
            mock_cursor_cm.callproc.return_value = None
            response = self.client.patch(url, data, format='json')
            
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_edit_nonexistent_project(self):
        """Test editing non-existent project"""
        url = reverse('edit-project', args=[999])
        data = {
            'name': 'Updated Project',
            'description': 'Updated Description'
        }
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor_cm = mock_cursor.return_value.__enter__.return_value
            mock_cursor_cm.fetchone.return_value = [False]
            response = self.client.patch(url, data, format='json')
            
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], "Project not found")

    def test_edit_project_unexpected_error(self):
        """Test project edit with unexpected error"""
        url = reverse('edit-project', args=[1])
        data = {
            'name': 'Updated Project',
            'description': 'Updated Description'
        }
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor_cm = mock_cursor.return_value.__enter__.return_value
            mock_cursor_cm.fetchone.return_value = [True]
            mock_cursor_cm.callproc.side_effect = Exception("Unexpected error")
            response = self.client.patch(url, data, format='json')
            
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(response.data['detail'], "An unexpected error occurred. Please try again later.")

class EditTodoTests(APITestCase):
    def test_edit_todo_success(self):
        """Test successful todo edit"""
        url = reverse('edit-todo', args=[1])
        data = {
            'project_id': 1,
            'title': 'Updated Todo',
            'description': 'Updated Description',
            'priority': 'high',
            'due_date': '2024-03-21'
        }
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor.return_value.__enter__.return_value.callproc.return_value = None
            response = self.client.patch(url, data, format='json')
            
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_edit_todo_invalid_data(self):
        """Test todo edit with invalid data"""
        url = reverse('edit-todo', args=[1])
        data = {'title': 'Missing required fields'}
        
        with patch('django.db.connection.cursor') as mock_cursor:
            mock_cursor_cm = mock_cursor.return_value.__enter__.return_value
            mock_cursor_cm.fetchone.return_value = [True]
            mock_cursor_cm.callproc.return_value = None
            mock_cursor_cm.fetchone.return_value = [True]
            response = self.client.patch(url, data, format='json')
            
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
