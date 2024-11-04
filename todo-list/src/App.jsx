import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContainer from "./components/MainContainer";
import AddTaskModal from "./components/AddTaskModal";
import Modal from "./components/Modal";
import AddProjectForm from "./components/AddProjectForm";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("allTasks");
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isTodoFormOpen, setIsTodoFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleTodoModal = () => {
    setIsTodoFormOpen((prev) => !prev);
  };

  const handleSelectedProject = (id) => {
    setSelectedProject(id);
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
          setSelectedProject = {setSelectedProject}
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
      </div>
    </>
  );
}

export default App;
