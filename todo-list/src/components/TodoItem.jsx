import axios from "axios";
import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types'; // Import PropTypes

export default function TodoItem(props) {
  TodoItem.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    dueDate: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    refreshTodos: PropTypes.func.isRequired,
  }; // Define propTypes

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null); // Create a ref to the menu

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
        props.refreshTodos(); // Refresh the todo list
      } catch (error) {
        console.error("Failed to delete todo:", error);
      }
    }
  };

  // Close menu if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="todo-item">
      <input type="checkbox" className="todo-checkbox" />
      <div className="todo-content">
        <div className="todo-title">{props.title}</div>
        <div className="todo-desc">{props.description}</div>
        <div className="todo-date">Due Date: {props.dueDate}</div>
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
            <div className="dropdown-item edit">Edit</div>
            <div className="dropdown-item delete" onClick={handleDelete}>
              Delete
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
