import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContainer from "./components/MainContainer";
import AddTaskModal from "./components/AddTaskModal";
import Modal from "./components/Modal";
import AddProjectForm from "./components/AddProjectForm";
import EditProjectForm from "./components/EditProjectForm";
import EditTaskModal from "./components/EditTaskModal";
import axios from "axios";


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("allTasks");
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [isTodoFormOpen, setIsTodoFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isEditTaskFormOpen, setIsEditTaskFormOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const toggleTodoModal = () => {
    setIsTodoFormOpen((prev) => !prev);
  };

  const handleSelectedProject = (id) => {
    setSelectedProject(id);
  };

  const openEditForm = (projectId) => {
    const project = projects.find((p) => p.project_id === projectId);
    if (project) {
      setProjectToEdit(project);
      setIsEditFormOpen(true);
    }
  };

  const openEditTaskForm = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      setIsEditTaskFormOpen(true);
    }
  };

  const closeEditForm = () => {
    setIsEditFormOpen(false);
  };

  const handleProjectUpdate = (updatedProject) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.project_id === updatedProject.project_id
          ? updatedProject
          : project
      )
    );
    setSelectedProject(updatedProject);
  };


  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/todos/");
      let filteredTodos = response.data;
      
      // Update the tasks state in parent component
      console.log("this should be the response.data", response.data);
      setTasks(response.data);

      if (selectedProject) {
        filteredTodos = filteredTodos.filter(
          (todo) => todo.project_id === selectedProject
        );
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const next7Days = new Date();
      next7Days.setDate(today.getDate() + 7);
      next7Days.setHours(0, 0, 0, 0); 

      if (activeItem === "today") {
        filteredTodos = filteredTodos.filter((todo) => {
          const dueDate = new Date(todo.due_date);
          dueDate.setHours(0, 0, 0, 0); 
          return dueDate.getTime() === today.getTime(); 
        });
      } else if (activeItem === "next7Days") {
        filteredTodos = filteredTodos.filter((todo) => {
          const dueDate = new Date(todo.due_date);
          dueDate.setHours(0, 0, 0, 0); 
          return dueDate >= today && dueDate < next7Days; 
        });
      }

      setTasks(filteredTodos);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };


  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/projects/");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
   
  

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className="container">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          isProjectFormOpen={isProjectFormOpen}
          setIsProjectFormOpen={setIsProjectFormOpen}
          selectedProject={selectedProject}
          handleSelectedProject={handleSelectedProject}
          projects={projects}
          setProjects={setProjects}
          setSelectedProject={setSelectedProject}
          openEditForm={openEditForm}
          fetchProjects={fetchProjects}
        />
        <div
          className={`main-container-wrapper no-transition ${
            isSidebarOpen ? "" : "shifted"
          }`}
        >
          <MainContainer
            toggleTodoModal={toggleTodoModal}
            handleSelectedProject={handleSelectedProject}
            projects={projects}
            setProjects={setProjects}
            activeItem={activeItem}
            openEditForm={openEditForm}
            selectedProject={selectedProject}
            tasks={tasks}
            setTasks={setTasks}
            openEditTaskForm={openEditTaskForm}
            fetchTodos={fetchTodos}
          />
        </div>
        {isTodoFormOpen && (
          <AddTaskModal
            setIsTodoFormOpen={setIsTodoFormOpen}
            selectedProject={selectedProject}
            fetchTodos={fetchTodos}
          />
        )}
        <Modal
          isOpen={isProjectFormOpen}
          onClose={() => setIsProjectFormOpen(false)}
        >
          <AddProjectForm setIsProjectFormOpen={setIsProjectFormOpen} fetchProjects={fetchProjects} />

        </Modal>
        
        {isEditFormOpen && selectedProject && (
          <Modal isOpen={isEditFormOpen} onClose={closeEditForm}>
            <EditProjectForm
              setIsEditFormOpen={setIsEditFormOpen}
              project={projectToEdit}
              onEditProject={handleProjectUpdate}
            />
          </Modal>
        )}
        {isEditTaskFormOpen && selectedTask && (
          <Modal
            isOpen={isEditTaskFormOpen}
            onClose={() => setIsEditTaskFormOpen(false)}
          >
            <EditTaskModal
              setIsEditTaskFormOpen={setIsEditTaskFormOpen}
              selectedTask={selectedTask}
              fetchTodos={fetchTodos}
            />
          </Modal>
        )}
      </div>
    </>
  );
}

export default App;
