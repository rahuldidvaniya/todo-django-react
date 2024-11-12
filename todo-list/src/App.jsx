import { useState, useRef } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContainer from "./components/MainContainer";
import AddTaskModal from "./components/AddTaskModal";
import Modal from "./components/Modal";
import AddProjectForm from "./components/AddProjectForm";
import EditProjectForm from "./components/EditProjectForm";
import EditTaskModal from "./components/EditTaskModal";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';

const showToast = {
  success: (message) => {
    toast.success(message, {
      style: { fontSize: '14px', fontWeight: '500' },
      progressStyle: { background: 'rgba(255, 255, 255, 0.7)' },
    });
  },
  error: (message) => {
    toast.error(message, {
      style: { fontSize: '14px', fontWeight: '500' },
      progressStyle: { background: 'rgba(255, 255, 255, 0.7)' },
    });
  },
  warning: (message) => {
    toast.warning(message, {
      style: { fontSize: '14px', fontWeight: '500' },
      progressStyle: { background: 'rgba(0, 0, 0, 0.2)' },
    });
  },
  info: (message) => {
    toast.info(message, {
      style: { fontSize: '14px', fontWeight: '500' },
      progressStyle: { background: 'rgba(255, 255, 255, 0.7)' },
    });
  }
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("allTasks");
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isTodoFormOpen, setIsTodoFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isEditTaskFormOpen, setIsEditTaskFormOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const initialLoadRef = useRef(true);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const toggleTodoModal = () => setIsTodoFormOpen(prev => !prev);
  const handleSelectedProject = (id) => setSelectedProject(id);
  const closeEditForm = () => setIsEditFormOpen(false);

  const openEditForm = (projectId) => {
    const project = projects.find((p) => p.project_id === projectId);
    if (project) {
      setProjectToEdit(project);
      setIsEditFormOpen(true);
    }
  };

  const openEditTaskForm = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsEditTaskFormOpen(true);
    }
  };

  const handleProjectUpdate = (updatedProject) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.project_id === updatedProject.project_id ? updatedProject : project
      )
    );
    setSelectedProject(updatedProject);
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/todos/");
      let filteredTodos = response.data;
      
      if (initialLoadRef.current) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check for overdue tasks
        const overdueTasks = filteredTodos.filter(todo => {
          const dueDate = new Date(todo.due_date);
          return dueDate < today && !todo.is_completed;
        });

        // Check for tasks due today
        const todayTasks = filteredTodos.filter(todo => {
          const dueDate = new Date(todo.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime() && !todo.is_completed;
        });

        if (overdueTasks.length > 0) {
          showToast.warning(`⚠️ You have ${overdueTasks.length} overdue tasks!`);
        }

        if (todayTasks.length > 0) {
          showToast.info(`📅 You have ${todayTasks.length} tasks due today!`);
        }

        initialLoadRef.current = false;
      }

      if (selectedProject) {
        filteredTodos = filteredTodos.filter(
          todo => todo.project_id === selectedProject
        );
      }

      if (activeItem === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        filteredTodos = filteredTodos.filter(todo => {
          if (!todo.due_date) return false;
          const dueDate = new Date(todo.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime() && !todo.is_completed;
        });
      } else if (activeItem === "next7Days") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const next7Days = new Date(today);
        next7Days.setDate(today.getDate() + 7);
        
        filteredTodos = filteredTodos.filter(todo => {
          if (!todo.due_date) return false;
          const dueDate = new Date(todo.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate >= today && dueDate <= next7Days && !todo.is_completed;
        });
      }

      setTasks(filteredTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      showToast.error("Failed to fetch tasks!");
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/projects/");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
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
          selectedProject={selectedProject}
          handleSelectedProject={handleSelectedProject}
          projects={projects}
          setProjects={setProjects}
          setSelectedProject={setSelectedProject}
          openEditForm={openEditForm}
          fetchProjects={fetchProjects}
        />
        <div className={`main-container-wrapper no-transition ${isSidebarOpen ? "" : "shifted"}`}>
          <MainContainer
            toggleTodoModal={toggleTodoModal}
            handleSelectedProject={handleSelectedProject}
            projects={projects}
            setProjects={setProjects}
            activeItem={activeItem}
            openEditForm={openEditForm}
            selectedProject={selectedProject}
            tasks={tasks}
            setTasks={setTasks}
            openEditTaskForm={openEditTaskForm}
            fetchTodos={fetchTodos}
          />
        </div>
        {isTodoFormOpen && (
          <AddTaskModal
            setIsTodoFormOpen={setIsTodoFormOpen}
            selectedProject={selectedProject}
            fetchTodos={fetchTodos}
          />
        )}
        <Modal isOpen={isProjectFormOpen} onClose={() => setIsProjectFormOpen(false)}>
          <AddProjectForm 
            setIsProjectFormOpen={setIsProjectFormOpen} 
            fetchProjects={fetchProjects} 
          />
        </Modal>
        
        {isEditFormOpen && selectedProject && (
          <Modal isOpen={isEditFormOpen} onClose={closeEditForm}>
            <EditProjectForm
              setIsEditFormOpen={setIsEditFormOpen}
              project={projectToEdit}
              onEditProject={handleProjectUpdate}
              setSelectedProject={setSelectedProject}
            />
          </Modal>
        )}
        {isEditTaskFormOpen && selectedTask && (
          <Modal isOpen={isEditTaskFormOpen} onClose={() => setIsEditTaskFormOpen(false)}>
            <EditTaskModal
              setIsEditTaskFormOpen={setIsEditTaskFormOpen}
              selectedTask={selectedTask}
              fetchTodos={fetchTodos}
            />
          </Modal>
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        icon={true}
        closeButton={true}
        transition={Slide}
      />
    </>
  );
}

export default App;
