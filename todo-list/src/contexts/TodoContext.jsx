import { createContext, useState,  useCallback, useRef } from "react";
import { api } from "../services/api";
import { showToast } from "../utils/toastConfig";
import { checkOverdueAndToday, filterTodosByTiming, sortTodosByPriority } from "../utils/todoFilters";
import { useUI } from "../hooks/useUI";
import { useProjects } from "../hooks/useProjects";
import PropTypes from "prop-types";

export const TodoContext = createContext();

export const TodoProvider = ({ children }) => {
    const { activeItem} = useUI();
    const { selectedProject } = useProjects();
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTodoFormOpen, setIsTodoFormOpen] = useState(false);
    const [isEditTaskFormOpen, setIsEditTaskFormOpen] = useState(false);
    const initialLoadRef = useRef(true);
    
    const openEditTaskForm = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsEditTaskFormOpen(true);
    }
  };

  const toggleTodoModal = () => setIsTodoFormOpen(prev => !prev);

  const fetchTodos = useCallback(async () => {
    try {
      const todos = await api.getTodos();
      let filteredTodos = todos;
      
      if (initialLoadRef.current) {
        const { overdueTasks, todayTasks } = checkOverdueAndToday(filteredTodos);

        if (overdueTasks.length > 0) {
          showToast.warning(`⚠️ You have ${overdueTasks.length} overdue tasks!`);
        }

        if (todayTasks.length > 0) {
          showToast.info(`📅 You have ${todayTasks.length} tasks due today!`);
        }

        initialLoadRef.current = false;
      }

      // Apply filters and sorting
      filteredTodos = filterTodosByTiming(filteredTodos, activeItem, selectedProject);
      filteredTodos = sortTodosByPriority(filteredTodos);

      setTasks(filteredTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      if (!error.response || error.response.status >= 500) {
        showToast.error("Failed to fetch tasks!");
      }
    }
  }, [activeItem, selectedProject]);

  const values = {
    tasks,
    setTasks,
    selectedTask,
    setSelectedTask,
    isTodoFormOpen,
    setIsTodoFormOpen,
    isEditTaskFormOpen,
    openEditTaskForm,
    fetchTodos,
    toggleTodoModal,
    setIsEditTaskFormOpen
  };

  return <TodoContext.Provider value={values}>{children}</TodoContext.Provider>;

}

TodoProvider.propTypes = {
    children: PropTypes.node.isRequired,
}
