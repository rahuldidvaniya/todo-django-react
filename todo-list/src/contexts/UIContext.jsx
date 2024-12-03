import { createContext, useState} from "react";
import { VIEW_MODES } from "../constants/constants";
import PropTypes from "prop-types";


export const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeItem, setActiveItem] = useState(VIEW_MODES.ALL_TASKS);

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    

    const values = {
        isSidebarOpen,
        setIsSidebarOpen,
        activeItem,
        setActiveItem,
        toggleSidebar,
    }

    return <UIContext.Provider value={values}>{children}</UIContext.Provider>;
}

UIProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

