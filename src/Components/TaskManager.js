import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const TaskManager = () => {
  // Initialize tareas state from local storage, or an empty array if no tareas exist
  const [tareas, settareas] = useState(() => {
    const storedtareas = localStorage.getItem('tareas');
    return storedtareas ? JSON.parse(storedtareas) : [];
  });

  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Update local storage whenever tareas state changes
  useEffect(() => {
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }, [tareas]);

  const handleAddTask = () => {
    if (newTask.trim() !== '') {
      const updatedtareas = [...tareas, { id: tareas.length + 1, text: newTask, completed: false }];
      settareas(updatedtareas);
      setNewTask('');
    }
  };

  const handleToggleCompletion = (taskId) => {
    const updatedtareas = tareas.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    settareas(updatedtareas);
  };

  const handleDeleteTask = (taskId) => {
    const updatedtareas = tareas.filter((task) => task.id !== taskId);
    settareas(updatedtareas);
  };

  const handleEditTask = (taskId, newText) => {
    const updatedtareas = tareas.map((task) =>
      task.id === taskId ? { ...task, text: newText } : task
    );
    settareas(updatedtareas);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredtareas = tareas.filter((task) => {
    if (filter === 'active') {
      return !task.completed;
    } else if (filter === 'completed') {
      return task.completed;
    } else {
      return true; // 'all'
    }
  });

  return (
    <div>
      <TextField
        label="Add a new task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleAddTask();
          }
        }}
      />
      <Button variant="contained" color="primary" onClick={handleAddTask}>
        Add Task
      </Button>

      <FormControl style={{ minWidth: 120, marginLeft: '1rem' }}>
        <InputLabel id="filter-label">Filter</InputLabel>
        <Select
          labelId="filter-label"
          value={filter}
          onChange={handleFilterChange}
        >
          <MenuItem value="all">All tareas</MenuItem>
          <MenuItem value="active">Active tareas</MenuItem>
          <MenuItem value="completed">Completed tareas</MenuItem>
        </Select>
      </FormControl>

      <List>
        {filteredtareas.map((task) => (
          <ListItem key={task.id} dense button>
            <FormControlLabel
              control={<Checkbox checked={task.completed} onChange={() => handleToggleCompletion(task.id)} />}
              label={task.text}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="edit" onClick={() => handleEditTask(task.id, prompt('Edit task', task.text))}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default TaskManager;