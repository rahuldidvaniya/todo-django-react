import PropTypes from "prop-types";
import { useEffect } from "react";
import ProjectItem from "./ProjectItem";
import { showToast } from "../utils/toastConfig";

export default function ProjectsContainer({
  toggleProjectForm,
  selectedProject,
  handleSelectedProject,
  projects,
  setProjects,
  openEditForm,
  fetchProjects,
  setActiveItem,
  fetchTodos,
}) {
  ProjectsContainer.propTypes = {
    toggleProjectForm: PropTypes.func.isRequired,
    selectedProject: PropTypes.number,
    handleSelectedProject: PropTypes.func.isRequired,
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
    setProjects: PropTypes.func.isRequired,
    openEditForm: PropTypes.func.isRequired,
    fetchProjects: PropTypes.func.isRequired,
    setActiveItem: PropTypes.func.isRequired,
    fetchTodos: PropTypes.func.isRequired,
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const removeProject = (id) => {
    setProjects((prevProject) =>
      prevProject.filter((project) => project.project_id !== id)
    );
  };

  return (
    <>
      <h3>Projects</h3>
      <hr />
      <div className="projects-container">
        {projects.map((project) => (
          <ProjectItem
            key={project.project_id}
            project={project}
            handleSelectedProject={handleSelectedProject}
            selectedProject={selectedProject}
            refreshProjects={() => removeProject(project.project_id)}
            openEditForm={openEditForm}
            fetchProjects={fetchProjects}
            setActiveItem={setActiveItem}
            fetchTodos={fetchTodos}
          
          />
        ))}
      </div>
      <div className="add-project" onClick={toggleProjectForm}>
        <img src="icons/queue.png" alt="Add Project" className="icon" />
        <p>Add Project</p>
      </div>
    </>
  );
}
