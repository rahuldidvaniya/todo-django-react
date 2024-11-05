import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContainer from "./components/MainContainer";
import AddTaskModal from "./components/AddTaskModal";
import Modal from "./components/Modal";
import AddProjectForm from "./components/AddProjectForm";
import EditProjectForm from "./components/EditProjectForm"; 
import EditTaskModal from "./components/EditTaskModal";

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


  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleTodoModal = () => {
    setIsTodoFormOpen((prev) => !prev);
  };

  const handleSelectedProject = (id) => {
    setSelectedProject(id);
  };



  const openEditForm = (projectId) => {
    const project = projects.find(p => p.project_id === projectId);
    if (project) {
      setProjectToEdit(project);
      setIsEditFormOpen(true);
    }
  };

  const openEditTaskForm = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsEditTaskFormOpen(true);
    }
  };



  const closeEditForm = () => {
    setIsEditFormOpen(false);
  };

  const handleProjectUpdate = (updatedProject) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.project_id === updatedProject.project_id ? updatedProject : project
      )
    );
    setSelectedProject(updatedProject);
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
        />
        <div
          className={`main-container-wrapper no-transition ${
            isSidebarOpen ? "" : "shifted"
          }`}
        >
          <MainContainer
            toggleTodoModal={toggleTodoModal}
            selectedProject={selectedProject}
            handleSelectedProject={handleSelectedProject}
            projects={projects}
            setProjects={setProjects}
            activeItem={activeItem}
            openEditForm={openEditForm} 
            tasks={tasks}
            setTasks={setTasks}
            openEditTaskForm={openEditTaskForm}
          />
        </div>
        {isTodoFormOpen && (
          <AddTaskModal
            setIsTodoFormOpen={setIsTodoFormOpen}
            selectedProject={selectedProject}
          />
        )}
        <Modal
          isOpen={isProjectFormOpen}
          onClose={() => setIsProjectFormOpen(false)}
        >
          <AddProjectForm setIsProjectFormOpen={setIsProjectFormOpen} />
        </Modal>
        {/* Full screen modal for editing project */}
        {isEditFormOpen && selectedProject && (
          <Modal isOpen={isEditFormOpen} onClose={closeEditForm}>
            <EditProjectForm
              setIsEditFormOpen={setIsEditFormOpen}
              project={projectToEdit}
              onEditProject={handleProjectUpdate}
            />
          </Modal>
        )}
        {isEditTaskFormOpen && selectedTask && (
          <Modal isOpen={isEditTaskFormOpen} onClose={() => setIsEditTaskFormOpen(false)}>
            <EditTaskModal 
              setIsEditTaskFormOpen={setIsEditTaskFormOpen} 
              selectedTask={selectedTask} 
            />
          </Modal>
        )}
      </div>
    </>
  );
}

export default App;
