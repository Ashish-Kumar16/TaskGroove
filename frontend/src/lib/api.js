// src/lib/api.js
const API_URL = "https://taskgroove.onrender.com/api";

// Retrieve token from localStorage
export const getToken = () => localStorage.getItem("authToken");

// Generic fetch wrapper to handle errors and authentication
const apiFetch = async (url, options = {}, requiresAuth = true) => {
  const token = requiresAuth ? getToken() : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && requiresAuth) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // maybe emit an event instead so React Router can handle it
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    let errMsg = "API request failed";
    try {
      const err = await response.json();
      errMsg = err.message || errMsg;
    } catch {
      // Ignore JSON parsing error, use default error message
    }
    throw new Error(errMsg);
  }

  if (response.status === 204) {
    // No Content
    return null;
  }

  return response.json();
};

// Authentication API Functions
export const login = (credentials) =>
  apiFetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",
      body: JSON.stringify(credentials),
    },
    false,
  );

export const register = (userData) =>
  apiFetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",
      body: JSON.stringify(userData),
    },
    false,
  );

// Existing API Functions (unchanged)
export const fetchUserProjects = () => apiFetch(`${API_URL}/projects/user`);

export const fetchProjectById = (projectId) =>
  apiFetch(`${API_URL}/projects/${projectId}`, {}, true);
export const fetchAssignedTasks = () => apiFetch(`${API_URL}/tasks/assigned`);

export const fetchMembers = () => apiFetch(`${API_URL}/members`);

export const fetchProjects = () => apiFetch(`${API_URL}/projects`);

export const fetchTasks = () => apiFetch(`${API_URL}/tasks`);

export const updateProject = (projectId, projectData) =>
  apiFetch(`${API_URL}/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(projectData),
  });

export const addProjectMember = (projectId, memberId) =>
  apiFetch(`${API_URL}/projects/${projectId}/members`, {
    method: "POST",
    body: JSON.stringify({ memberId }),
  });

export const createProject = (projectData) =>
  apiFetch(`${API_URL}/projects`, {
    method: "POST",
    body: JSON.stringify(projectData),
  });

export const deleteProject = (projectId) =>
  apiFetch(`${API_URL}/projects/${projectId}`, {
    method: "DELETE",
  });

export const addMember = (memberData) =>
  apiFetch(`${API_URL}/members`, {
    method: "POST",
    body: JSON.stringify(memberData),
  });

export const updateMember = ({ id, ...memberData }) =>
  apiFetch(`${API_URL}/members/${id}`, {
    method: "PUT",
    body: JSON.stringify(memberData),
  });

export const deleteMember = (id) =>
  apiFetch(`${API_URL}/members/${id}`, {
    method: "DELETE",
  });

export const createTask = (taskData) =>
  apiFetch(`${API_URL}/tasks`, {
    method: "POST",
    body: JSON.stringify(taskData),
  });

export const updateTask = (taskId, taskData) =>
  apiFetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(taskData),
  });

export const deleteTask = (taskId) =>
  apiFetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });

export const fetchTasksByProject = (projectId) =>
  apiFetch(`${API_URL}/tasks?projectId=${projectId}`);
