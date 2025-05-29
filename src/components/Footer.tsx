import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => (
  <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'background.paper', mt: 4 }}>
    <Typography variant="body2" color="text.secondary">
      &copy; {new Date().getFullYear()} Music Playlist Manager
    </Typography>
  </Box>
);

export default Footer;
