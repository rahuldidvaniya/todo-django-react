from django import urls
from django.urls import path
from .views import ProjectCreateView, ProjectListView, TodoCreateView, TodoListView, TodoDeleteView

urlpatterns = [
    path("api/projects/create/", ProjectCreateView.as_view(), name="create-project"),
    path("api/projects/", ProjectListView.as_view(), name="projects"),
    path("api/todos/create/", TodoCreateView.as_view(), name="create-todos"),
    path("api/todos/", TodoListView.as_view(), name="todos"),
    path("api/todos/<int:id>/", TodoDeleteView.as_view(), name="delete-todo")
]
