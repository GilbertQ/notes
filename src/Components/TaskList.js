import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Checkbox, FormControl, FormLabel, Radio, RadioGroup, FormControlLabel, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid } from '@mui/material';

const INITIAL_tarea = [];

function TaskList() {
  const [tarea, settarea] = useState(() => {
    const savedtarea = localStorage.getItem('tarea');
    return savedtarea ? JSON.parse(savedtarea) : INITIAL_tarea;
  });
  const [filter, setFilter] = useState('all');
  const [editIndex, setEditIndex] = useState(-1);
  const [editText, setEditText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const updateAndStoreTasks = (newtarea) => {
    settarea(newtarea);
    localStorage.setItem('tarea', JSON.stringify(newtarea));
  };

  const handleAddTask = (text) => {
    if (text && text.trim() !== "") {
      const newtarea = [...tarea, { text, completed: false }];
      updateAndStoreTasks(newtarea);
    }
  };

  const handleToggleComplete = (index) => {
    const newtarea = [...tarea];
    newtarea[index].completed = !newtarea[index].completed;
    updateAndStoreTasks(newtarea);
  };

  const handleOpenDeleteDialog = (index) => {
    setTaskToDelete(index);
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete !== null) {
      const newtarea = [...tarea];
      newtarea.splice(taskToDelete, 1);
      updateAndStoreTasks(newtarea);
      setTaskToDelete(null);
    }
    setOpenDialog(false);
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setOpenDialog(false);
  };

  const handleSaveEdit = (index) => {
    if (editText && editText.trim() !== "") {
      const newtarea = [...tarea];
      newtarea[index].text = editText;
      updateAndStoreTasks(newtarea);
    }
    setEditIndex(-1);
  };

  const handleCancelEdit = () => {
    setEditIndex(-1);
  };

  const handleStartEdit = (index) => {
    setEditIndex(index);
    setEditText(tarea[index].text);
  };

  const filteredtarea = tarea.filter((task) => {
    if (filter === 'all') return true;
    return filter === 'active' ? !task.completed : task.completed;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <h2>Task List</h2>
      <FormControl component="fieldset">
        <FormLabel component="legend">Filter:</FormLabel>
        <RadioGroup row value={filter} onChange={(e) => setFilter(e.target.value)}>
          <FormControlLabel value="all" control={<Radio />} label="All tasks" />
          <FormControlLabel value="active" control={<Radio />} label="Active tasks" />
          <FormControlLabel value="completed" control={<Radio />} label="Completed tasks" />
        </RadioGroup>
      </FormControl>
      <TextField
        label="Add Task"
        fullWidth
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAddTask(e.target.value);
            e.target.value = '';
          }
        }}
        required
      />
      <Grid item xs={12} style={{ flexGrow: 1, overflow: 'auto' }}>
        <List>
          {filteredtarea.map((task, index) => (
            <ListItem key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <Grid container spacing={1} alignItems="center">
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
                    <ListItemText
                      primary={task.text}
                      primaryTypographyProps={{
                        noWrap: true,
                        style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleToggleComplete(index)} size="small">
                      <Checkbox edge="end" checked={task.completed} />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(index)} size="small">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => editIndex === index ? handleSaveEdit(index) : handleStartEdit(index)} size="small">
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Grid>

      {/* Confirmation Dialog for Deletion */}
      <Dialog
        open={openDialog}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TaskList;

