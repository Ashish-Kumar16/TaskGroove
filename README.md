# Task Groove

Task Groove is a modern project management web application designed to help teams organize, track, and manage their work efficiently. Built with React, Redux, and Material-UI, it provides a visual, collaborative, and flexible platform for managing projects, tasks, and team members.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Available Pages](#available-pages)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Task Management**: Create, assign, and track tasks with details like descriptions, due dates, priorities, and assignees.
- **Project Management**: Organize projects with progress tracking, team member assignments, and task boards.
- **Team Collaboration**: Manage team members, assign roles, and link them to projects.
- **Kanban Boards**: Visualize project tasks with a drag-and-drop interface for task status updates.
- **User Authentication**: Secure login and registration with token-based authentication.
- **Responsive Design**: Fully responsive UI for seamless use on desktop and mobile devices.
- **Real-time Notifications**: Toast notifications for user actions and errors.
- **Settings**: Customize user preferences like notifications and themes.

## Technologies

- **Frontend**:
  - React (v18.x)
  - Redux Toolkit for state management
  - React Router for navigation
  - Material-UI (MUI) for UI components
  - Lucide React for icons
  - Tanstack Query for data fetching
- **Backend** (Assumed, based on API integration):
  - RESTful API hosted at `https://taskgroove.onrender.com/api`
- **Tools**:
  - Vite for build tooling
  - ESLint for code linting
  - React Query for API caching and state management
  - Date-fns for date formatting

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Ashish-Kumar16/TaskGroove.git
   cd frontend
   ```

2. **Install Dependencies**:
   Ensure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   The application relies on a backend API at `https://taskgroove.onrender.com/api`. Ensure the API is accessible or set up a local backend if necessary. No additional environment variables are required for the frontend unless specified by the backend.

4. **Run the Application**:
   Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or another port if specified).

5. **Build for Production**:
   To create a production build:
   ```bash
   npm run build
   ```

## Usage

1. **Access the Application**:
   Open your browser and navigate to `http://localhost:5173`.

2. **Register or Log In**:
   - New users can register at `/register`.
   - Existing users can log in at `/login`.

3. **Dashboard**:
   After logging in, users are redirected to the dashboard (`/dashboard`), which provides an overview of projects, tasks, and recent activities.

4. **Manage Projects and Tasks**:
   - Create new projects at `/projects/new`.
   - Add tasks at `/tasks/new`.
   - View and manage tasks in a Kanban board at `/projects/:projectId/board`.

5. **Team Management**:
   - Add or manage team members at `/team`.
   - Assign members to projects or update their details.

6. **Settings**:
   Customize user preferences at `/settings`.

## Project Structure

```
TaskGroove/frontend/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── public/
│   └── vite.svg
├── README.md
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── CleanThemeProvider.jsx
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── hooks/
│   │   ├── use-mobile.jsx
│   │   ├── use-toast.js
│   │   └── useAppRedux.js
│   ├── index.css
│   ├── lib/
│   │   └── api.js
│   ├── main.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Index.jsx
│   │   ├── Login.jsx
│   │   ├── NewProject.jsx
│   │   ├── NewTask.jsx
│   │   ├── NotFound.jsx
│   │   ├── ProjectBoard.jsx
│   │   ├── ProjectDetail.jsx
│   │   ├── Projects.jsx
│   │   ├── Register.jsx
│   │   ├── Settings.jsx
│   │   ├── Tasks.jsx
│   │   └── Team.jsx
│   ├── store/
│   │   ├── authSlice.js
│   │   ├── membersSlice.js
│   │   ├── projectsSlice.js
│   │   ├── store.js
│   │   └── tasksSlice.js
│   └── types/
│       └── index.ts
└── vite.config.js
```

- **src/components/**: Reusable UI components and layouts.
- **src/hooks/**: Custom hooks for mobile detection, toast notifications, and Redux integration.
- **src/lib/**: API utility functions for interacting with the backend.
- **src/pages/**: Page components for different routes.
- **src/store/**: Redux slices for managing authentication, projects, tasks, and members.

## Available Pages

- `/`: Landing page with an overview of Task Groove.
- `/login`: User login page.
- `/register`: User registration page.
- `/dashboard`: User dashboard with project and task summaries.
- `/projects`: List of all projects with grid and list views.
- `/projects/new`: Form to create a new project.
- `/projects/:projectId`: Detailed view of a specific project.
- `/projects/:projectId/board`: Kanban board for project tasks.
- `/tasks`: List of all tasks with filtering options.
- `/tasks/new`: Form to create a new task.
- `/team`: Team management page for adding and editing members.
- `/settings`: User settings for preferences like notifications.
- `*`: 404 Not Found page for invalid routes.

## API Integration

The application integrates with a backend API at `https://taskgroove.onrender.com/api`. Key endpoints include:

- **Authentication**:
  - `POST /auth/login`: Log in a user.
  - `POST /auth/register`: Register a new user.
- **Projects**:
  - `GET /projects`: Fetch all projects.
  - `POST /projects`: Create a new project.
  - `GET /projects/:id`: Fetch a specific project.
  - `PUT /projects/:id`: Update a project.
  - `DELETE /projects/:id`: Delete a project.
- **Tasks**:
  - `GET /tasks`: Fetch all tasks.
  - `POST /tasks`: Create a new task.
  - `PUT /tasks/:id`: Update a task.
  - `DELETE /tasks/:id`: Delete a task.
- **Members**:
  - `GET /members`: Fetch all team members.
  - `POST /members`: Add a new member.
  - `PUT /members/:id`: Update a member.
  - `DELETE /members/:id`: Delete a member.

The `src/lib/api.js` file handles API requests with token-based authentication and error handling.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m "Add your feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

Please ensure your code follows the ESLint rules and includes appropriate tests.
