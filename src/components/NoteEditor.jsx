import React, { useState, useContext, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { NotesContext } from '../context/NotesContext';

export default function NoteEditor({ note, onClose }) {
  const isEditMode = Boolean(note);
  const { createNote, updateNote } = useContext(NotesContext);

  const [label, setLabel] = useState(note?.label || '');
  const [content, setContent] = useState(note?.content || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLabel(note?.label || '');
    setContent(note?.content || '');
  }, [note]);

  const handleSave = async () => {
    setSaving(true);
    if (isEditMode) {
      updateNote(note._id, { label, content });
    } else {
      createNote({ label, content });
    }
    setSaving(false);
    onClose();
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditMode ? 'Edit Note' : 'New Note'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Label"
          fullWidth
          margin="normal"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          autoFocus
        />
        <TextField
          label="Content"
          fullWidth
          margin="normal"
          multiline
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving || !label.trim()}>
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
