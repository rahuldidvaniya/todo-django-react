import TodosContainer from "./TodosContainer";
import { useProjects } from '../hooks/useProjects';
import { useUI } from '../hooks/useUI';

export default function MainContainer() {
  
  const { projects, selectedProject } = useProjects();
  const { activeItem } = useUI();
 
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

      <TodosContainer/>
    </div>
  );
}
