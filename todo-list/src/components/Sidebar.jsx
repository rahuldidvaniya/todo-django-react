import PropTypes from "prop-types"; // Import PropTypes
import ProjectsContainer from "./ProjectsContainer";
import { VIEW_MODES } from '../constants/constants';
import { useProjects } from '../hooks/useProjects';
import { useUI } from '../hooks/useUI';
import { useTodos } from '../hooks/useTodos';

export default function Sidebar() {
  Sidebar.propTypes = {
    isSidebarOpen: PropTypes.bool.isRequired,
    activeItem: PropTypes.string.isRequired,
    setActiveItem: PropTypes.func.isRequired,
    fetchTodos: PropTypes.func.isRequired,
  };

  const { setSelectedProject, setIsProjectFormOpen} = useProjects();
  const {isSidebarOpen, activeItem, setActiveItem} = useUI();
  const { fetchTodos } = useTodos();

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
        toggleProjectForm={toggleProjectForm}
        setActiveItem={setActiveItem}
        fetchTodos={fetchTodos}
      />
    </aside>
  );
}
