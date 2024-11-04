import TodosContainer from "./TodosContainer";
import PropTypes from "prop-types";

export default function MainContainer({
  toggleTodoModal,
  projects,
  selectedProject,
  activeItem,
}) {
  MainContainer.propTypes = {
    toggleTodoModal: PropTypes.func.isRequired,
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
    selectedProject: PropTypes.number,
    activeItem: PropTypes.string.isRequired,
  }; // Define propTypes

  // Find the selected project based on the openedProject ID
  const openedProject = projects.find(
    (project) => project.project_id === selectedProject
  );

  return (
    <div className="main-container">
      <div className="main-heading">
        {selectedProject && openedProject
          ? `Current Project: ${openedProject.project_name}`
          : activeItem === "today"
          ? "Today's Tasks"
          : activeItem === "next7Days"
          ? "Upcoming Tasks (Next 7 Days)"
          : "Complete Task List"}
      </div>

      <TodosContainer
        toggleTodoModal={toggleTodoModal}
        selectedProject={selectedProject}
        activeItem={activeItem}
      />
    </div>
  );
}
