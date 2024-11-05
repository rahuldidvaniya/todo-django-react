import AddProjectForm from "./AddProjectForm";
import axios from "axios";
import Modal from "./Modal";
import PropTypes from "prop-types";
import { useEffect } from "react";
import ProjectItem from "./ProjectItem";

export default function ProjectsContainer({
  isProjectFormOpen,
  toggleProjectForm,
  selectedProject,
  handleSelectedProject,
  projects,
  setProjects,
  openEditForm,
}) {
  ProjectsContainer.propTypes = {
    isProjectFormOpen: PropTypes.bool.isRequired,
    toggleProjectForm: PropTypes.func.isRequired,
    selectedProject: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        project_id: PropTypes.number.isRequired,
        project_name: PropTypes.string.isRequired,
        description: PropTypes.string
      })
    ]),
    handleSelectedProject: PropTypes.func.isRequired,
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
    setProjects: PropTypes.func.isRequired,
    openEditForm: PropTypes.func.isRequired,
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/projects/");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const addProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

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
          />
        ))}
      </div>
      <div className="add-project" onClick={toggleProjectForm}>
        <img src="icons/queue.png" alt="Add Project" className="icon" />
        <p>Add Project</p>
      </div>
      {isProjectFormOpen && (
        <Modal>
          <AddProjectForm
            onAddProject={addProject}
            closeForm={toggleProjectForm}
          />
        </Modal>
      )}
    </>
  );
}
