import axios from "axios";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { toast } from 'react-toastify';

export default function TodoItem(props) {
  TodoItem.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    refreshTodos: PropTypes.func.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    openEditTaskForm: PropTypes.func.isRequired,
    fetchTodos: PropTypes.func.isRequired,
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(props.isCompleted);
  const menuRef = useRef(null);

  const isOverdue = !isCompleted && new Date(props.dueDate) < new Date();

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );

    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/todos/${props.id}/`);
        setIsMenuOpen(false);
        props.refreshTodos();
        toast.success("Task deleted successfully! 🎉");
      } catch (error) {
        console.error("Failed to delete todo:", error);
        toast.error("Failed to delete task!");
      }
    }
  };

  const toggleCompletion = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/todo/completed/${props.id}/`);
      const newCompletionStatus = !isCompleted;
      setIsCompleted(newCompletionStatus);
      props.fetchTodos();
      
      if (newCompletionStatus) {
        toast.success("Task marked as completed! 🎉", {
          toastId: `complete-${props.id}`,
        });
      }
      
    } catch (error) {
      console.error("Failed to update todo status:", error);
      toast.error("Failed to update task status!", {
        toastId: `error-${props.id}`,
      });
    }
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`todo-item ${isCompleted ? "completed" : ""} ${
        isOverdue ? "overdue" : ""
      }`}
      
    >
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={isCompleted}
        onChange={toggleCompletion}
      />
      <div className="todo-content">
        <div className="todo-title">{props.title}</div>
        <div className="todo-desc">{props.description}</div>
        <div className="todo-date">
          Due Date:{" "}
          <span className={isOverdue ? "overdue-date" : ""}>
            {props.dueDate}
          </span>
        </div>
        <div className="badges">
          <div
            className={`todo-priority ${
              props.priority === "low"
                ? "low"
                : props.priority === "medium"
                ? "medium"
                : "high"
            }`}
          >
            {props.priority.charAt(0).toUpperCase() + props.priority.slice(1)}
          </div>
          <div
            className={`status-badge ${
              isCompleted ? "completed" : isOverdue ? "overdue" : "pending"
            }`}
          >
            {isCompleted ? "Completed" : isOverdue ? "Overdue" : "Pending"}
          </div>
        </div>
      </div>
      <div className="todo-actions" ref={menuRef}>
        <img
          src="icons/menu.png"
          className="icon menu-icon"
          alt="Menu Icon"
          onClick={handleMenuClick}
        />
        {isMenuOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item edit" onClick={() => props.openEditTaskForm(props.id)}>Edit</div>
            <div className="dropdown-item delete" onClick={handleDelete}>
              Delete
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
