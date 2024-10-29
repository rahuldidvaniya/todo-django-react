import { useState } from "react";
import axios from "axios";
import PropTypes from 'prop-types'; // Import PropTypes

export default function TodoForm({ onAddTodo }) {
  TodoForm.propTypes = {
    onAddTodo: PropTypes.func.isRequired,
  }; // Define propTypes

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium"); // Default value

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTodo = { title, description, priority };
      const response = await axios.post(
        "http://127.0.0.1:8000/api/todos/",
        newTodo
      );
      onAddTodo(response.data); // Call the callback with the new todo data
      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Todo Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button type="submit">Add Todo</button>
    </form>
  );
}
