import TodoItem from "./TodoItem";
import { useEffect} from "react";
import { useProjects } from '../hooks/useProjects';
import { useUI } from '../hooks/useUI';
import { useTodos } from '../hooks/useTodos';

export default function TodosContainer() {

  const { selectedProject } = useProjects();
  const { activeItem } = useUI();
  const { tasks, setTasks, openEditTaskForm, toggleTodoModal, fetchTodos } = useTodos();


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
