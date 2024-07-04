import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, FormControl, FormLabel, Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid } from '@mui/material';

const INITIAL_tarea = [];

function TaskList() {
  const [tarea, settarea] = useState(() => {
    const savedtarea = localStorage.getItem('tarea');
    return savedtarea ? JSON.parse(savedtarea) : INITIAL_tarea;
  });
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [editIndex, setEditIndex] = useState(-1);
  const [editText, setEditText] = useState('');

  const updateAndStoreTasks = (newtarea) => {
    settarea(newtarea);
    localStorage.setItem('tarea', JSON.stringify(newtarea));
  };
  
  const handleAddTask = (text) => {
    const newtarea = [...tarea, { text, completed: false }];
    updateAndStoreTasks(newtarea);
  };
  
  const handleToggleComplete = (index) => {
    const newtarea = [...tarea];
    newtarea[index].completed = !newtarea[index].completed;
    updateAndStoreTasks(newtarea);
  };
  
  const handleDeleteTask = (index) => {
    const newtarea = [...tarea];
    newtarea.splice(index, 1);
    updateAndStoreTasks(newtarea);
  };
  
  const handleSaveEdit = (index) => {
    const newtarea = [...tarea];
    newtarea[index].text = editText;
    updateAndStoreTasks(newtarea);
    setEditIndex(-1); // Stop editing
  };
  
  const handleCancelEdit = () => {
    setEditIndex(-1); // Stop editing
  };
  
  const handleStartEdit = (index) => {
    setEditIndex(index);
    setEditText(tarea[index].text); // Set initial editText to current task text
  };
  
  // Filter tarea based on selected view
  const filteredtarea = tarea.filter((task) => {
    if (filter === 'all') return true;
    return filter === 'active' ? !task.completed : task.completed;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h2>Task List</h2>
      <FormControl component="fieldset">
      <FormLabel component="legend" sx={{ textAlign: "left" }}>Filter:</FormLabel>
        <RadioGroup row aria-label="filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <FormControlLabel value="all" control={<Radio />} label="All tasks" />
          <FormControlLabel value="active" control={<Radio />} label="Active tasks" />
          <FormControlLabel value="completed" control={<Radio />} label="Completed tasks" />
        </RadioGroup>
      </FormControl>
      <TextField label="Add Task" fullWidth onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleAddTask(e.target.value);
          e.target.value = '';
        }
      }} />
<Grid item xs={12} style={{ flexGrow: 1, overflow: 'auto' }}>
      <List>
  {filteredtarea.map((task, index) => (
    <ListItem key={index} style={{ display: 'flex', alignItems: 'center' }}>
      <Grid container spacing={1}>
        <Grid item xs={10}>
          {editIndex === index ? (
            <TextField
              fullWidth
              multiline
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveEdit(index);
                } else if (e.key === 'Escape') {
                  handleCancelEdit();
                }
              }}
            />
          ) : (
            <ListItemText style={{ flexGrow: 1 }} primary={task.text} />
          )}
        </Grid>
        <Grid item xs={2} display="flex" justifyContent="flex-end">
          <ListItemSecondaryAction style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => handleToggleComplete(index)}>
              <Checkbox edge="end" checked={task.completed} />
            </IconButton>
            <IconButton onClick={() => handleDeleteTask(index)}>
              <DeleteIcon />
            </IconButton>
            {editIndex === index ? (
              <IconButton onClick={() => handleSaveEdit(index)}>
                <EditIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => handleStartEdit(index)}>
                <EditIcon />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        </Grid>
      </Grid>
    </ListItem>
  ))}
</List>

</Grid>
</div>
  );
}

export default TaskList;
