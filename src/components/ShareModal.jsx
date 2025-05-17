import React, { useState, useContext } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { NotesContext } from '../context/NotesContext';

export default function ShareModal({ note, onClose }) {
  const { updateNote, shareNote } = useContext(NotesContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleShare = () => {
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    shareNote(note._id, email.trim());
    setEmail('');
  };

  const handleRemoveShare = (emailToRemove) => {
    const newSharedWith = note.sharedWith.filter((e) => e !== emailToRemove);
    updateNote(note._id, { sharedWith: newSharedWith });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Share Note: {note.label}</DialogTitle>
      <DialogContent>
        <TextField
          label="Email to share with"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(error)}
          helperText={error}
        />
        <Button variant="contained" fullWidth onClick={handleShare}>
          Share
        </Button>
        <Typography sx={{ mt: 2, mb: 1 }} variant="subtitle1">
          Shared With:
        </Typography>
        <List dense>
          {note.sharedWith.length === 0 && <Typography>No one yet.</Typography>}
          {note.sharedWith.map((email) => (
            <ListItem
              key={email}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleRemoveShare(email)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={email} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
