import { useState } from "react";
import "./App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("allTasks");
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isTodoFormOpen, setIsTodoFormOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleTodoModal = () => {
    setIsTodoFormOpen((prev) => !prev);
  };
  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className="container">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          isProjectFormOpen={isProjectFormOpen}
          setIsProjectFormOpen={setIsProjectFormOpen}
        />
        <div
          className={`main-container-wrapper no-transition ${
            isSidebarOpen ? "" : "shifted"
          }`}
        >
          <MainContainer toggleTodoModal={toggleTodoModal} />
        </div>
        {isTodoFormOpen && (
          <AddTaskModal setIsTodoFormOpen={setIsTodoFormOpen} />
        )}
      </div>
    </>
  );
}

export default App;

function Header({ toggleSidebar }) {
  return (
    <header className="header no-transition">
      <img
        src="icons/icons8-menu-32.png"
        onClick={toggleSidebar}
        className="menu-icon"
        alt=""
      />
      <div className="logo">
        <img src="icons/task-list.png" className="logo-icon" alt="" />
        <span className="taskly">
          <span className="Task">Task</span>
          <span className="ly">ly</span>
        </span>
      </div>
      <div />
    </header>
  );
}

function Sidebar({
  isSidebarOpen,
  activeItem,
  setActiveItem,
  isProjectFormOpen,
  setIsProjectFormOpen,
}) {
  const handleItemClick = (item) => {
    setActiveItem(item);
  };
  const toggleProjectForm = () => {
    setIsProjectFormOpen((prev) => !prev);
  };
  return (
    <aside className={`sidebar  ${isSidebarOpen ? "" : "open"}`}>
      <h3>Home</h3>
      <hr />
      <div className="home-container">
        <div
          className={`home-item ${activeItem === "allTasks" ? "active" : ""}`}
          onClick={() => handleItemClick("allTasks")}
        >
          <img src="icons/check-list.png" className="icon" alt="" />
          <p>All Tasks</p>
        </div>
        <div
          className={`home-item ${activeItem === "today" ? "active" : ""}`}
          onClick={() => handleItemClick("today")}
        >
          <img src="icons/today.png" className="icon" alt="" />
          <p>Today</p>
        </div>
        <div
          className={`home-item ${activeItem === "next7Days" ? "active" : ""}`}
          onClick={() => handleItemClick("next7Days")}
        >
          <img src="icons/7-days.png" className="icon" alt="" />
          <p>Next 7 Days</p>
        </div>
      </div>
      <h3>Projects</h3>
      <hr />
      <div className="projects-container">
        {isProjectFormOpen && (
          <AddProjectForm setIsProjectFormOpen={setIsProjectFormOpen} />
        )}
        <div className="add-project" onClick={toggleProjectForm}>
          <img src="icons/queue.png" alt="Add Project" className="icon" />
          <p>Add Project</p>
        </div>
      </div>
    </aside>
  );
}

function AddProjectForm({ setIsProjectFormOpen }) {
  const handleCloseProjectForm = () => setIsProjectFormOpen(false);
  return (
    <div className="project-form">
      <div>
        <img src="icons/iteration.png" className="icon" alt="Project Icon" />
        <input
          type="text"
          className="project-input"
          placeholder="Enter project name"
          required=""
        />
      </div>
      <div className="form-actions">
        <button className="btn-add">Add</button>
        <button className="btn-cancel" onClick={handleCloseProjectForm}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function MainContainer({ toggleTodoModal }) {
  return (
    <div className="main-container">
      <div className="main-heading">All Tasks</div>
      <TodosContainer toggleTodoModal={toggleTodoModal} />
    </div>
  );
}

function AddTaskModal({ setIsTodoFormOpen }) {
  const closeModal = () => setIsTodoFormOpen(false);
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-btn" onClick={closeModal}>
          ×
        </span>
        <h3>Add New Task</h3>
        <div className="task-form">
          <input
            type="text"
            className="todo-title-input"
            placeholder="Enter Task Title"
          />
          <textarea
            className="todo-desc-input"
            placeholder="Enter Task Description"
            defaultValue={""}
          />
          <select className="todo-priority-input">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input type="date" className="todo-date-input" />
        </div>
        <div className="form-actions">
          <button className="add-btn">Add Task</button>
          <button className="cancel-btn" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function TodosContainer({ toggleTodoModal }) {
  return (
    <div className="todos-container">
      <TodoItem />
      <TodoItem />
      <TodoItem />
      <TodoForm />
      <div className="add-todo" onClick={toggleTodoModal}>
        <img src="icons/queue.png" className="icon" alt="Add Task Icon" />
        <p>Add Task</p>
      </div>
    </div>
  );
}

function TodoItem() {
  return (
    <div className="todo-item">
      <input type="checkbox" className="todo-checkbox" />
      <div className="todo-content">
        <div className="todo-title">Task Title</div>
        <div className="todo-desc">Task Description</div>
        <div className="todo-date">Due Date: 2024-09-30</div>
        <div className="todo-priority high">High Priority</div>
      </div>
      <div className="todo-actions">
        <img src="icons/menu.png" className="icon menu-icon" alt="Menu Icon" />
        <div className="dropdown-menu">
          <div className="dropdown-item edit">Edit</div>
          <div className="dropdown-item delete">Delete</div>
        </div>
      </div>
    </div>
  );
}

function TodoForm() {
  return (
    <div className="todo-form hidden">
      <div className="todo-item">
        <div className="todo-content">
          <input
            type="text"
            className="todo-title-input"
            placeholder="Enter Task Title"
          />
          <textarea
            className="todo-desc-input"
            placeholder="Enter Task Description"
            defaultValue={""}
          />
          <select className="todo-priority-input">
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input type="date" className="todo-date-input" />
        </div>
      </div>
      <div className="form-actions">
        <button className="add-btn">Add</button>
        <button className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
}
