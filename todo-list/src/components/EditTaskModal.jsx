import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { toast } from 'react-toastify';

export default function EditTaskModal({ setIsEditTaskFormOpen, selectedTask, fetchTodos }) {
  EditTaskModal.propTypes = {
    setIsEditTaskFormOpen: PropTypes.func.isRequired,
    selectedTask: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      due_date: PropTypes.string,
      project_id: PropTypes.string.isRequired,
      fetchTodos: PropTypes.func.isRequired,
    }).isRequired,
  };

  const closeModal = () => setIsEditTaskFormOpen(false);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Task title is required")
      .min(2, "Task title must be at least 2 characters long"),
    description: Yup.string()
      .required("Task description is required")
      .min(5, "Task description must be at least 5 characters long"),
    priority: Yup.string().required("Select a priority"),
    due_date: Yup.date().required("Select a due date").nullable(),
  });

  const formik = useFormik({
    initialValues: {
      title: selectedTask?.title || "",
      description: selectedTask?.description || "",
      priority: selectedTask?.priority || "low",
      due_date: selectedTask?.due_date || null,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const todoData = {
        ...values,
        project_id: selectedTask.project_id,
      };
      try {
        const response = await axios.patch(
          `http://localhost:8000/api/todos/edit/${selectedTask.id}/`,
          todoData
        );
        console.log("Todo updated:", response.data);
        closeModal();
        fetchTodos();
        toast.success("Task updated successfully! 🎉");
      } catch (error) {
        console.error("Error updating todo:", error);
        toast.error("Failed to update task!");
      }
    },
  });

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeModal}>
          ×
        </span>
        <h3>Edit Task</h3>
        <form onSubmit={formik.handleSubmit} className="task-form">
          {/* Form fields remain the same, just changed button text */}
          <input
            type="text"
            name="title"
            className="todo-title-input"
            placeholder="Enter Task Title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title ? (
            <div className="error">{formik.errors.title}</div>
          ) : null}
          <textarea
            name="description"
            className="todo-desc-input"
            placeholder="Enter Task Description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="error">{formik.errors.description}</div>
          ) : null}
          <select
            name="priority"
            className="todo-priority-input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.priority}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          {formik.touched.priority && formik.errors.priority ? (
            <div className="error">{formik.errors.priority}</div>
          ) : null}
          <input
            type="date"
            name="due_date"
            className="todo-date-input"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.due_date ? formik.values.due_date : ""}
            min={todayDate}
          />
          {formik.touched.due_date && formik.errors.due_date ? (
            <div className="error">{formik.errors.due_date}</div>
          ) : null}
          <div className="form-actions">
            <button type="submit" className="add-btn">
              Update Task
            </button>
            <button type="button" className="cancel-btn" onClick={closeModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}