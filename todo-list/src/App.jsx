import { useState, useRef, useCallback } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContainer from "./components/MainContainer";
import AddTaskModal from "./components/AddTaskModal";
import Modal from "./components/Modal";
import AddProjectForm from "./components/AddProjectForm";
import EditProjectForm from "./components/EditProjectForm";
import EditTaskModal from "./components/EditTaskModal";
import { api } from './services/api';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { showToast } from "./utils/toastConfig";
import { filterTodosByTiming, sortTodosByPriority, checkOverdueAndToday } from './utils/todoFilters';
import { VIEW_MODES } from './constants/constants';



function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(VIEW_MODES.ALL_TASKS);
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
  }, [selectedProject, activeItem]);

  const fetchProjects = async () => {
    try {
      const projectsData = await api.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      showToast.error("Failed to fetch projects!");
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
          fetchTodos={fetchTodos}
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
        autoClose={2000}
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
        limit={1}
      />
    </>
  );
}

export default App;
