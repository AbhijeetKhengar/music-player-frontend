import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown === 0) {
      navigate('/home');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <Container maxWidth="sm" sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Box textAlign="center" mt={8}>
        <SentimentVeryDissatisfiedIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Oops! The page you are looking for does not exist.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Redirecting to Home in <b>{countdown}</b> seconds...
        </Typography>
        <Button variant="contained" sx={{ mt: 4 }} onClick={() => navigate('/home')}>
          Go to Home Now
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
