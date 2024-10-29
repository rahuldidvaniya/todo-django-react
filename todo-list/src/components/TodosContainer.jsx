import TodoItem from "./TodoItem";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types'; // Import PropTypes

export default function TodosContainer({
  toggleTodoModal,
  selectedProject,
  activeItem,
}) {
  TodosContainer.propTypes = {
    toggleTodoModal: PropTypes.func.isRequired,
    selectedProject: PropTypes.string,
    activeItem: PropTypes.string.isRequired,
  }; // Define propTypes

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, [selectedProject, activeItem]);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/todos/");
      let filteredTodos = response.data;

      if (selectedProject) {
        filteredTodos = filteredTodos.filter(
          (todo) => todo.project_id === selectedProject
        );
      }

      const today = new Date();
      const next7Days = new Date();
      next7Days.setDate(today.getDate() + 7);

      if (activeItem === "today") {
        filteredTodos = filteredTodos.filter((todo) => {
          const dueDate = new Date(todo.due_date);
          return (
            dueDate.getFullYear() === today.getFullYear() &&
            dueDate.getMonth() === today.getMonth() &&
            dueDate.getDate() === today.getDate()
          );
        });
      } else if (activeItem === "next7Days") {
        filteredTodos = filteredTodos.filter((todo) => {
          const dueDate = new Date(todo.due_date);
          return dueDate >= today && dueDate <= next7Days;
        });
      }

      setTodos(filteredTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const removeTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <>
      <div className="todos-container">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            title={todo.title}
            description={todo.description}
            priority={todo.priority}
            dueDate={todo.due_date}
            isCompleted={todo.is_completed}
            refreshTodos={() => removeTodo(todo.id)}
          />
        ))}
      </div>
      <div className="add-todo" onClick={toggleTodoModal}>
        <img src="icons/queue.png" className="icon" alt="Add Task Icon" />
        <p>Add Task</p>
      </div>
    </>
  );
}
