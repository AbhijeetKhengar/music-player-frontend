import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link as MuiLink } from '@mui/material';
import { register } from '../api/authApi';
import { useAppDispatch } from '../store';
import { loginSuccess } from '../slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await register(username, email, password);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" gutterBottom>Register</Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <MuiLink component={Link} to="/login">
            Already have an account? Login
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
