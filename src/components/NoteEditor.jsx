import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { NotesContext } from '../context/NotesContext';

export default function NoteEditor({ note, onClose, isReadOnly }) {
  const isEditMode = Boolean(note);
  const { createNote, updateNote } = useContext(NotesContext);

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [collaborators, setCollaborators] = useState(note?.collaborators || []);

  const saveTimeout = useRef(null);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setCollaborators(note?.collaborators || []);
    setError(null);
  }, [note]);

  // Debounced autosave every 5 seconds or on blur
  useEffect(() => {
    if (isReadOnly) return; // Do not save if read-only
  }, [title, content]);

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      if (isEditMode) {
        await updateNote(note.id, { title, content });
      } else {
        await createNote({ title, content });
      }
    } catch {
      setError('Failed to save note. Please try again.');
    }
    setSaving(false);
    onClose();
  };

  const handleBlur = () => {
    if (isReadOnly) return;
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    // Do not call handleSave on blur to avoid confusion with explicit save button
    // handleSave();
  };

  const handleCancel = () => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Note' : 'New Note'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          disabled={isReadOnly || saving}
        />
        <TextField
          label="Content"
          fullWidth
          margin="normal"
          multiline
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          disabled={isReadOnly || saving}
        />
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Collaborators:</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {collaborators.length === 0 && <Typography>No collaborators</Typography>}
            {collaborators.map((collab) => (
              <Avatar key={collab.userId} alt={collab.userId} sx={{ width: 32, height: 32 }}>
                {collab.userId[0].toUpperCase()}
              </Avatar>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving || isReadOnly}>
          {isEditMode ? 'Save' : 'Add'}
        </Button>
        {saving && (
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Saving...
            </Typography>
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
}
