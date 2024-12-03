import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProjectProvider } from './contexts/ProjectContext'
import { UIProvider } from './contexts/UIContext'
import { TodoProvider } from './contexts/TodoContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIProvider>
    <ProjectProvider>
      <TodoProvider>
        <App /> 
      </TodoProvider>
      </ProjectProvider>
    </UIProvider>
  </StrictMode>,
)
