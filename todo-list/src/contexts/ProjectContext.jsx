import { createContext, useState} from "react";
import { api } from "../services/api";
import { showToast } from "../utils/toastConfig";
import PropTypes from "prop-types";


 export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);

    const handleSelectedProject = (id) => setSelectedProject(id);

    const closeEditForm = () => setIsEditFormOpen(false);

    const openEditForm = (projectId) => {
        const project = projects.find((p) => p.project_id === projectId);
        console.log("Project to edit", project);
        if (project) {
            setProjectToEdit(project);
            setIsEditFormOpen(true);
        }
    }

    const handleProjectUpdate = (updateProject) => {
        setProjects((prevProjects) => prevProjects.map((project) => project.project_id === updateProject.project_id ? updateProject : project));
        setSelectedProject(updateProject);
    };

    const fetchProjects = async () => {
        try {
            const projectData = await api.getProjects();
            setProjects(projectData);
        } catch (error) {
            console.error("Error fetching projects", error);
            showToast.error("Error fetching projects");
            
        }
    };

    const values = {
        projects,
        setProjects,
        selectedProject,
        setSelectedProject,
        isProjectFormOpen,
        setIsProjectFormOpen,
        isEditFormOpen,
        setIsEditFormOpen,
        projectToEdit,
        handleSelectedProject,
        closeEditForm,
        openEditForm,
        handleProjectUpdate,
        fetchProjects,
    };

    return <ProjectContext.Provider value={values}>{children}</ProjectContext.Provider>;
}


ProjectProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
