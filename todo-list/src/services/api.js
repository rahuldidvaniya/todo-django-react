import axios from "axios";
import { config } from "../config/config";
import { API_ENDPOINTS } from "../constants/constants";

const BASE_URL = config.API_BASE_URL;

export const api = {

    async getProjects() {
        const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.PROJECTS}/`);
        return response.data;
    },

    async createProject(projectData) {
        const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.PROJECT_CREATE}/`, projectData);
        return response.data;
    },

    async updateProject(projectId, projectData) {
        const response = await axios.put(`${BASE_URL}${API_ENDPOINTS.PROJECT_EDIT}/${projectId}/`, projectData);
        return response.data;
    },

    async deleteProject(projectId) {
        await axios.delete(`${BASE_URL}${API_ENDPOINTS.PROJECTS}/${projectId}/`);
    },

    // Todos
    async getTodos() {
        const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.TODOS}/`);
        return response.data;
    },

    async createTodo(todoData) {
        const response = await axios.post(`${BASE_URL}${API_ENDPOINTS.TODO_CREATE}/`, todoData);
        return response.data;
    },

    async updateTodo(todoId, todoData) {
        const response = await axios.put(`${BASE_URL}${API_ENDPOINTS.TODO_EDIT}/${todoId}/`, todoData);
        return response.data;
    },

    async deleteTodo(todoId) {
        await axios.delete(`${BASE_URL}${API_ENDPOINTS.TODOS}/${todoId}/`);
    },

    async toggleTodoCompletion(todoId) {
        const response = await axios.put(`${BASE_URL}${API_ENDPOINTS.TODO_COMPLETION}/${todoId}/`);
        return response.data;
    },

    async editTodo(todoId, todoData) {
        const response = await axios.patch(`${BASE_URL}${API_ENDPOINTS.TODO_EDIT}/${todoId}/`, todoData);
        return response.data;
    },

    async editProject(projectId, projectData) {
        const response = await axios.patch(`${BASE_URL}${API_ENDPOINTS.PROJECT_EDIT}/${projectId}/`, projectData);
        return response.data;
    }

}
