import { useFormik } from "formik";
import * as Yup from "yup";
import PropTypes from "prop-types";
import { showToast } from "../utils/toastConfig";
import { api } from "../services/api";
import { PRIORITY_LEVELS } from '../constants/constants';
import { useProjects } from '../hooks/useProjects';
import { useTodos } from '../hooks/useTodos';


export default function AddTaskModal() {
  const { selectedProject } = useProjects();
  const { setIsTodoFormOpen, fetchTodos } = useTodos();

  AddTaskModal.propTypes = {
    setIsTodoFormOpen: PropTypes.func.isRequired,
    fetchTodos: PropTypes.func.isRequired,
  };

  const closeModal = () => setIsTodoFormOpen(false);

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Task title is required")
      .min(2, "Task title must be at least 2 characters long"),
    description: Yup.string()
      .required("Task description is required")
      .min(5, "Task description must be at least 5 characters long"),
    priority: Yup.string().required("Select a priority"),
    dueDate: Yup.date().required("Select a due date").nullable(),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      priority: PRIORITY_LEVELS.LOW,
      dueDate: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const todoData = {
        ...values,
        project_id: selectedProject,
      };
      try {
        const response = await api.createTodo(todoData);
        console.log("Todo added:", response.data);
        closeModal();
        fetchTodos();
        showToast.success("Task added successfully! 🎉");
      } catch (error) {
        console.error("Error adding todo:", error);
        showToast.error("Failed to add task!");
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
        <h3>Add New Task</h3>
        <form onSubmit={formik.handleSubmit} className="task-form">
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
            value={formik.values.dueDate ? formik.values.dueDate : ""}
            min={todayDate} // Set min date to today
          />
          {formik.touched.dueDate && formik.errors.dueDate ? (
            <div className="error">{formik.errors.dueDate}</div>
          ) : null}
          <div className="form-actions">
            <button type="submit" className="add-btn">
              Add Task
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
