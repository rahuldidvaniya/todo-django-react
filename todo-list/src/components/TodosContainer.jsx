import TodoItem from "./TodoItem";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export default function TodosContainer({
  toggleTodoModal,
  selectedProject,
  activeItem,
}) {
  TodosContainer.propTypes = {
    toggleTodoModal: PropTypes.func.isRequired,
    selectedProject: PropTypes.number,
    activeItem: PropTypes.string.isRequired,
  };

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
      today.setHours(0, 0, 0, 0);
      const next7Days = new Date();
      next7Days.setDate(today.getDate() + 7);
      next7Days.setHours(0, 0, 0, 0); // Set time to the start of the day

      if (activeItem === "today") {
        filteredTodos = filteredTodos.filter((todo) => {
          const dueDate = new Date(todo.due_date);
          dueDate.setHours(0, 0, 0, 0); // Set time to the start of the day
          return dueDate.getTime() === today.getTime(); // Check for exact match
        });
      } else if (activeItem === "next7Days") {
        filteredTodos = filteredTodos.filter((todo) => {
          const dueDate = new Date(todo.due_date);
          dueDate.setHours(0, 0, 0, 0); // Set time to the start of the day
          return dueDate >= today && dueDate < next7Days; // Include only due dates within the next 7 days
        });
      }

      setTodos(filteredTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  // Function to refresh todos
  const refreshTodos = () => {
    fetchTodos();
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
            refreshTodos={refreshTodos} // Pass the refresh function here
          />
        ))}
      </div>
      {selectedProject && (
        <div className="add-todo" onClick={toggleTodoModal}>
          <img src="icons/queue.png" className="icon" alt="Add Task Icon" />
          <p>Add Task</p>
        </div>
      )}
    </>
  );
}
