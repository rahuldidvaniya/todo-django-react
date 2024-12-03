import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MainContainer from "./components/MainContainer";
import AddTaskModal from "./components/AddTaskModal";
import Modal from "./components/Modal";
import AddProjectForm from "./components/AddProjectForm";
import EditProjectForm from "./components/EditProjectForm";
import EditTaskModal from "./components/EditTaskModal";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify';
import { useProjects } from './hooks/useProjects';
import { useUI } from './hooks/useUI';
import { useTodos } from './hooks/useTodos';



function App() {
  const { isProjectFormOpen, isEditFormOpen, setIsProjectFormOpen,closeEditForm, selectedProject } = useProjects();
  const { isSidebarOpen,toggleSidebar } = useUI();
  const { isTodoFormOpen, isEditTaskFormOpen, selectedTask, setIsEditTaskFormOpen } = useTodos();

  return (
    <>
      <Header toggleSidebar={toggleSidebar} />
      <div className="container">
        <Sidebar/>
        <div className={`main-container-wrapper no-transition ${isSidebarOpen ? "" : "shifted"}`}>
          <MainContainer/>
        </div>
        {isTodoFormOpen && (
          <AddTaskModal/>
        )}
        <Modal isOpen={isProjectFormOpen} onClose={() => setIsProjectFormOpen(false)}>
          <AddProjectForm/>
        </Modal>
        
        {isEditFormOpen && selectedProject && (
          <Modal isOpen={isEditFormOpen} onClose={closeEditForm}>
            <EditProjectForm/>
          </Modal>
        )}
        {isEditTaskFormOpen && selectedTask && (
          <Modal isOpen={isEditTaskFormOpen} onClose={() => setIsEditTaskFormOpen(false)}>
            <EditTaskModal/>
          </Modal>
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        icon={true}
        closeButton={true}
        transition={Slide}
        limit={1}
      />
    </>
  );
}

export default App;
