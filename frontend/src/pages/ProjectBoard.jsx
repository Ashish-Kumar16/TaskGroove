import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  Box,
  Container,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Plus,
  MoreHorizontal,
  Clock,
  MoveLeft,
  MoveRight,
  ChevronLeft,
  MessageSquare,
  Paperclip,
} from "lucide-react";

// Mock Data and Types
const initialColumns = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: 1,
        title: "Research competitors",
        description: "Look at similar products in the market",
        status: "todo",
        priority: "Low",
        dueDate: "2023-05-25",
        assignee: {
          id: 1,
          name: "John Doe",
          avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
        },
        comments: 2,
        attachments: 1,
      },
      {
        id: 2,
        title: "Create wireframes",
        description: "Design initial wireframes for homepage",
        status: "todo",
        priority: "Medium",
        dueDate: "2023-05-28",
        comments: 0,
        attachments: 0,
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    tasks: [
      {
        id: 3,
        title: "Implement authentication",
        description: "Set up user login and registration",
        status: "inprogress",
        priority: "High",
        dueDate: "2023-05-20",
        assignee: {
          id: 2,
          name: "Jane Smith",
          avatar:
            "https://ui-avatars.com/api/?name=Jane+Smith&background=random",
        },
        comments: 5,
        attachments: 2,
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    tasks: [
      {
        id: 4,
        title: "Product page design",
        description: "Create responsive design for the product page",
        status: "review",
        priority: "Medium",
        dueDate: "2023-05-18",
        assignee: {
          id: 3,
          name: "Mike Johnson",
          avatar:
            "https://ui-avatars.com/api/?name=Mike+Johnson&background=random",
        },
        comments: 3,
        attachments: 1,
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: 5,
        title: "Initial project setup",
        description:
          "Set up the project repository and development environment",
        status: "done",
        priority: "High",
        dueDate: "2023-05-10",
        assignee: {
          id: 1,
          name: "John Doe",
          avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
        },
        comments: 2,
        attachments: 0,
      },
    ],
  },
];

const TaskCard = ({ task, colIndex, colsCount, moveTask }) => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <CardHeader
      title={<Typography variant="subtitle1">{task.title}</Typography>}
      action={
        <IconButton size="small">
          <MoreHorizontal size={16} />
        </IconButton>
      }
      sx={{ pb: 0, "& .MuiCardHeader-content": { flex: "1 1 auto", pb: 0 } }}
    />
    <CardContent sx={{ pt: 1, pb: 0 }}>
      <Typography variant="body2" color="text.secondary" noWrap>
        {task.description}
      </Typography>
      <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <Chip
          label={task.priority}
          size="small"
          sx={{
            borderColor:
              task.priority === "High"
                ? "error.main"
                : task.priority === "Medium"
                ? "warning.main"
                : "success.main",
            color:
              task.priority === "High"
                ? "error.main"
                : task.priority === "Medium"
                ? "warning.main"
                : "success.main",
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
          }}
        >
          <Clock size={14} style={{ marginRight: 4 }} />
          <Typography variant="caption">
            {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>
    </CardContent>
    <CardActions sx={{ justifyContent: "space-between", pt: 1, px: 2, pb: 2 }}>
      <Box>
        {colIndex > 0 && (
          <IconButton
            size="small"
            onClick={() => moveTask(task.id, task.status, "left")}
          >
            <MoveLeft size={16} />
          </IconButton>
        )}
        {colIndex < colsCount - 1 && (
          <IconButton
            size="small"
            onClick={() => moveTask(task.id, task.status, "right")}
          >
            <MoveRight size={16} />
          </IconButton>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {task.assignee && (
          <Avatar src={task.assignee.avatar} sx={{ width: 24, height: 24 }}>
            {task.assignee.name.slice(0, 2).toUpperCase()}
          </Avatar>
        )}
        {task.comments > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <MessageSquare size={14} style={{ marginRight: 2 }} />
            <Typography variant="caption">{task.comments}</Typography>
          </Box>
        )}
        {task.attachments > 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "text.secondary",
            }}
          >
            <Paperclip size={14} style={{ marginRight: 2 }} />
            <Typography variant="caption">{task.attachments}</Typography>
          </Box>
        )}
      </Box>
    </CardActions>
  </Card>
);

const Column = ({ column, index, total, moveTask, onAddTask }) => (
  <Box
    sx={{
      width: 280,
      flexShrink: 0,
      bgcolor: "grey.100",
      borderRadius: 1,
      p: 1,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Box
      sx={{
        mb: 1,
        p: 1,
        bgcolor: "grey.200",
        borderRadius: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
        {column.title} ({column.tasks.length})
      </Typography>
      <IconButton size="small" onClick={() => onAddTask(column.id)}>
        <Plus size={16} />
      </IconButton>
    </Box>
    <Box sx={{ flex: 1, overflowY: "auto" }}>
      {column.tasks.map((t) => (
        <TaskCard
          key={t.id}
          task={t}
          colIndex={index}
          colsCount={total}
          moveTask={moveTask}
        />
      ))}
    </Box>
  </Box>
);

const ProjectBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [columns, setColumns] = useState(initialColumns);
  const [newColOpen, setNewColOpen] = useState(false);
  const [newColTitle, setNewColTitle] = useState("");

  const moveTask = (taskId, fromId, dir) => {
    setColumns((cols) => {
      const c = JSON.parse(JSON.stringify(cols));
      const i = c.findIndex((col) => col.id === fromId);
      const j = dir === "left" ? i - 1 : i + 1;
      if (j < 0 || j >= c.length) return cols;
      const taskIdx = c[i].tasks.findIndex((t) => t.id === taskId);
      const [task] = c[i].tasks.splice(taskIdx, 1);
      task.status = c[j].id;
      c[j].tasks.push(task);
      return c;
    });
  };

  const addColumn = () => {
    if (!newColTitle.trim()) return;
    setColumns((cols) => [
      ...cols,
      { id: newColTitle.toLowerCase(), title: newColTitle, tasks: [] },
    ]);
    setNewColTitle("");
    setNewColOpen(false);
  };

  return (
    <DashboardLayout>
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ChevronLeft size={16} />}
            onClick={() => navigate(`/projects/${projectId}`)}
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#333333",
              },
            }}
          >
            Back
          </Button>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Project {projectId} Board
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
          {columns.map((col, idx) => (
            <Column
              key={col.id}
              column={col}
              index={idx}
              total={columns.length}
              moveTask={moveTask}
              onAddTask={() => {}}
            />
          ))}
          <Box sx={{ width: 280, flexShrink: 0, p: 1 }}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ height: 56, borderStyle: "dashed", color: "black" }}
              startIcon={<Plus size={16} />}
              onClick={() => setNewColOpen(true)}
            >
              Add Column
            </Button>
          </Box>
        </Box>

        <Dialog open={newColOpen} onClose={() => setNewColOpen(false)}>
          <DialogTitle>Add New Column</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Column Title"
              fullWidth
              value={newColTitle}
              onChange={(e) => setNewColTitle(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setNewColOpen(false)}
              sx={{ color: "black" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={addColumn}
              sx={{
                background: "black",
                "&:hover": {
                  backgroundColor: "#333333",
                },
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </DashboardLayout>
  );
};

export default ProjectBoard;
