
export interface Member {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  projects?: Project[];
  tasks: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
  progress: number;
  dueDate: string;
  members: Member[];
  tasksCompleted: number;
  totalTasks: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  project: {
    id: number;
    name: string;
  };
  assignee: {
    id: number;
    name: string;
    avatar: string;
  };
  completed: boolean;
}
