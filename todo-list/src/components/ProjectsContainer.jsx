import AddProjectForm from "./AddProjectForm";
import axios from "axios";
import Modal from "./Modal";
import PropTypes from 'prop-types'; // Import PropTypes
import { useEffect } from 'react'; // Import useEffect

export default function ProjectsContainer({
  isProjectFormOpen,
  toggleProjectForm,
  selectedProject,
  handleSelectedProject,
  projects,
  setProjects,
}) {
  ProjectsContainer.propTypes = {
    isProjectFormOpen: PropTypes.bool.isRequired,
    toggleProjectForm: PropTypes.func.isRequired,
    selectedProject: PropTypes.string,
    handleSelectedProject: PropTypes.func.isRequired,
    projects: PropTypes.arrayOf(PropTypes.object).isRequired,
    setProjects: PropTypes.func.isRequired,
  }; // Define propTypes

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
  // Function to handle adding a new project
  const addProject = (newProject) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  return (
    <>
      <h3>Projects</h3>
      <hr />
      <div className="projects-container">
        {projects.map((project) => (
          <div
            key={project.project_id}
            className={`project ${
              project.project_id === selectedProject ? "active" : ""
            }`}
            onClick={() => handleSelectedProject(project.project_id)}
          >
            <div>
              <img
                src="icons/iteration.png"
                className="icon"
                alt="Project Icon"
              />
              <p>{project.project_name}</p>
            </div>
            <img src="icons/menu.png" className="icon three-dot" />
          </div>
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
