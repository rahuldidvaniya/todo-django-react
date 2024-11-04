import PropTypes from "prop-types"; // Import PropTypes
import ProjectsContainer from "./ProjectsContainer";
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
  setSelectedProject
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
  };

  const handleItemClick = (item) => {
    if (item === activeItem) {
      // If the clicked item is already active, clear the selected project
      setActiveItem("allTasks"); // Reset to a default state
      setSelectedProject(null); // Clear the selected project
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
      <ProjectsContainer
        isProjectFormOpen={isProjectFormOpen}
        setIsProjectFormOpen={setIsProjectFormOpen}
        toggleProjectForm={toggleProjectForm}
        selectedProject={selectedProject}
        handleSelectedProject={handleSelectedProject}
        projects={projects}
        setProjects={setProjects}
      />
    </aside>
  );
}
