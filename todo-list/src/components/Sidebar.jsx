import PropTypes from "prop-types"; // Import PropTypes
import ProjectsContainer from "./ProjectsContainer";
import { VIEW_MODES } from '../constants/constants';

export default function Sidebar({
  isSidebarOpen,
  activeItem,
  setActiveItem,
  isProjectFormOpen,
  setIsProjectFormOpen,
  selectedProject,
  handleSelectedProject,
  projects,
  setProjects,
  setSelectedProject,
  openEditForm,
  fetchProjects,
  fetchTodos,
}) {
  Sidebar.propTypes = {
    isSidebarOpen: PropTypes.bool.isRequired,
    activeItem: PropTypes.string.isRequired,
    setActiveItem: PropTypes.func.isRequired,
    isProjectFormOpen: PropTypes.bool.isRequired,
    setIsProjectFormOpen: PropTypes.func.isRequired,
    selectedProject: PropTypes.number.isRequired,
    handleSelectedProject: PropTypes.func.isRequired,
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
    setProjects: PropTypes.func.isRequired,
    setSelectedProject: PropTypes.func.isRequired,
    openEditForm: PropTypes.func.isRequired,
    fetchProjects: PropTypes.func.isRequired,
  };

  const handleItemClick = (item) => {
    if (item === activeItem) {
      setActiveItem(VIEW_MODES.ALL_TASKS);
      setSelectedProject(null);
    } else {
      setActiveItem(item);
    }
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
          className={`home-item ${activeItem === VIEW_MODES.ALL_TASKS ? "active" : ""}`}
          onClick={() => handleItemClick(VIEW_MODES.ALL_TASKS)}
        >
          <img src="icons/check-list.png" className="icon" alt="" />
          <p>All Tasks</p>
        </div>
        <div
          className={`home-item ${activeItem === VIEW_MODES.TODAY ? "active" : ""}`}
          onClick={() => handleItemClick(VIEW_MODES.TODAY)}
        >
          <img src="icons/today.png" className="icon" alt="" />
          <p>Today</p>
        </div>
        <div
          className={`home-item ${activeItem === VIEW_MODES.NEXT_7_DAYS ? "active" : ""}`}
          onClick={() => handleItemClick(VIEW_MODES.NEXT_7_DAYS)}
        >
          <img src="icons/7-days.png" className="icon" alt="" />
          <p>Next 7 Days</p>
        </div>
      </div>
      <ProjectsContainer
        isProjectFormOpen={isProjectFormOpen}
        setIsProjectFormOpen={setIsProjectFormOpen}
        toggleProjectForm={toggleProjectForm}
        selectedProject={selectedProject}
        handleSelectedProject={handleSelectedProject}
        projects={projects}
        setProjects={setProjects}
        openEditForm={openEditForm}
        fetchProjects={fetchProjects}
        setActiveItem={setActiveItem}
        fetchTodos={fetchTodos}
      />
    </aside>
  );
}
