import TodoItem from "./TodoItem";
import { useEffect} from "react";
import PropTypes from "prop-types"; 

export default function TodosContainer({
  toggleTodoModal,
  selectedProject,
  activeItem,
  tasks,
  setTasks,
  openEditTaskForm,
  fetchTodos
}) {
  TodosContainer.propTypes = {
    toggleTodoModal: PropTypes.func.isRequired,
    selectedProject: PropTypes.number,
    activeItem: PropTypes.string.isRequired,
    tasks: PropTypes.array.isRequired,
    setTasks: PropTypes.func.isRequired,
    openEditTaskForm: PropTypes.func.isRequired,
    fetchTodos: PropTypes.func.isRequired,
  };

  

  useEffect(() => {
    fetchTodos();
  }, [selectedProject, activeItem]);

  

  const removeTodo = (id) => {
    setTasks((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <>
      <div className="todos-container">
        {tasks.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            title={todo.title}
            description={todo.description}
            priority={todo.priority}
            dueDate={todo.due_date}
            isCompleted={todo.is_completed}
            refreshTodos={() => removeTodo(todo.id)}
            openEditTaskForm={openEditTaskForm}
            fetchTodos={fetchTodos}
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
