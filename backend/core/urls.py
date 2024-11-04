from django import urls
from django.urls import path
from .views import ProjectCreateView, ProjectListView, TodoCreateView, TodoListView, TodoDeleteView, ProjectDeleteView, ToggleTodoCompleted, EditProject

urlpatterns = [
    path("api/projects/create/", ProjectCreateView.as_view(), name="create-project"),
    path("api/projects/", ProjectListView.as_view(), name="projects"),
    path("api/todos/create/", TodoCreateView.as_view(), name="create-todos"),
    path("api/todos/", TodoListView.as_view(), name="todos"),
    path("api/todos/<int:id>/", TodoDeleteView.as_view(), name="delete-todo"),
    path("api/projects/<int:id>/", ProjectDeleteView.as_view(), name="delete-project"),
    path("api/todo/completed/<int:id>/", ToggleTodoCompleted.as_view(), name="toggle-completed"),
    path("api/todos/edit/<int:id>/", EditProject.as_view(),  name="edit-project"),

]
