import React, { useContext, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Fab,
  CircularProgress,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { NotesContext } from '../context/NotesContext';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import ShareModal from '../components/ShareModal';

export default function Dashboard() {
  const { notes, loading } = useContext(NotesContext);

  const [editingNote, setEditingNote] = useState(null);
  const [sharingNote, setSharingNote] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Notes
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {notes.myNotes.length === 0 && (
              <Typography sx={{ m: 2 }}>No notes found.</Typography>
            )}
            {notes.myNotes.map((note) => (
              <Grid item xs={12} sm={6} md={4} key={note._id}>
                <NoteCard
                  note={note}
                  onEdit={() => setEditingNote(note)}
                  onShare={() => setSharingNote(note)}
                />
              </Grid>
            ))}
          </Grid>

          {/* Floating Add Button */}
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: 'fixed', bottom: 32, right: 32 }}
            onClick={() => setIsCreating(true)}
          >
            <AddIcon />
          </Fab>

          {/* Create/Edit Modal */}
          {(isCreating || editingNote) && (
            <NoteEditor
              note={editingNote}
              onClose={() => {
                setEditingNote(null);
                setIsCreating(false);
              }}
            />
          )}

          {/* Share Modal */}
          {sharingNote && (
            <ShareModal
              note={sharingNote}
              onClose={() => setSharingNote(null)}
            />
          )}
        </>
      )}
    </Container>
  );
}
