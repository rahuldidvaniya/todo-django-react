import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import { showToast } from "../utils/toastConfig";
import { api } from "../services/api";
import { useProjects } from "../hooks/useProjects";

export default function ProjectItem({
  project,
  setActiveItem,
  fetchTodos,
}) {
  const { handleSelectedProject, selectedProject, openEditForm, fetchProjects } = useProjects();
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
        await api.deleteProject(project.project_id);
        setIsMenuOpen(false);
        setActiveItem("allTasks");
        handleSelectedProject(null);
        fetchProjects();
        fetchTodos();
        showToast.success("Project deleted successfully! 🎉");
      } catch (error) {
        console.error("Failed to delete project:", error);
        showToast.error("Failed to delete project!");
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
  setActiveItem: PropTypes.func.isRequired,
  fetchTodos: PropTypes.func.isRequired,
};
