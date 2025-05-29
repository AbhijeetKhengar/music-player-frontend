import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

interface PlaylistFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  initialName?: string;
  isEdit?: boolean;
}

const PlaylistFormModal: React.FC<PlaylistFormModalProps> = ({ open, onClose, onSubmit, initialName = '', isEdit = false }) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name.trim());
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{isEdit ? 'Edit Playlist' : 'Create Playlist'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="Playlist Name"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">{isEdit ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PlaylistFormModal;
