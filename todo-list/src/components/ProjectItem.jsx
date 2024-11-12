import axios from "axios";
import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";

export default function ProjectItem({
  project,
  handleSelectedProject,
  selectedProject,
  openEditForm,
  fetchProjects,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleMenuClick = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(
          `http://127.0.0.1:8000/api/projects/${project.project_id}/`
        );
        setIsMenuOpen(false);
        fetchProjects();
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  const handleEdit = () => {
    openEditForm(project.project_id);
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      key={project.project_id}
      className={`project ${
        project.project_id === selectedProject ? "active" : ""
      }`}
      onClick={() => handleSelectedProject(project.project_id)}
    >
      <div>
        <img src="icons/iteration.png" className="icon" alt="Project Icon" />
        <p>{project.project_name}</p>
      </div>

      <div className="project-actions" ref={menuRef}>
        <img
          src="icons/menu.png"
          className="icon three-dot"
          onClick={handleMenuClick}
        />
        {isMenuOpen && (
          <div className="project-dropdown">
            <div className="dropdown-item edit" onClick={handleEdit}>
              Edit
            </div>
            <div className="dropdown-item delete" onClick={handleDelete}>
              Delete
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

ProjectItem.propTypes = {
  project: PropTypes.shape({
    project_id: PropTypes.number.isRequired,
    project_name: PropTypes.string.isRequired,
  }).isRequired,
  handleMenuClick: PropTypes.func.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  handleSelectedProject: PropTypes.func.isRequired,
  selectedProject: PropTypes.number.isRequired,
  openEditForm: PropTypes.func.isRequired, 
  fetchProjects: PropTypes.func.isRequired,
};
