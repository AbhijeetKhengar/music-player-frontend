import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <LibraryMusicIcon sx={{ mr: 2 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Music Playlist Manager
        </Typography>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
