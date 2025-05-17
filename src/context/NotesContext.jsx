import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { apiFetch } from '../api/apiClient';

export const NotesContext = createContext();

export function NotesProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchNotes = async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit, search });
    const data = await apiFetch(`/notes?${params.toString()}`);
    setNotes(data.notes);
    setPagination({ page: data.page, limit: data.limit, total: data.total });
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchNotes(pagination.page, pagination.limit, searchTerm);
    } else {
      setNotes([]);
    }
  }, [user, pagination.page, pagination.limit, searchTerm]);

  const createNote = async (note) => {
    await apiFetch('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
    fetchNotes(pagination.page, pagination.limit, searchTerm);
  };

  const updateNote = async (id, updatedFields) => {
    await apiFetch(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedFields),
    });
    fetchNotes(pagination.page, pagination.limit, searchTerm);
  };

  const deleteNote = async (id) => {
    await apiFetch(`/notes/${id}`, { method: 'DELETE' });
    fetchNotes(pagination.page, pagination.limit, searchTerm);
  };

  const shareNote = async (id, email) => {
    await apiFetch(`/notes/${id}/share`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    fetchNotes(pagination.page, pagination.limit, searchTerm);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        pagination,
        searchTerm,
        setSearchTerm,
        setPagination,
        createNote,
        updateNote,
        deleteNote,
        shareNote,
        fetchNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
