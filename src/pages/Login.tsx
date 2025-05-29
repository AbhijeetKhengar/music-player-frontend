import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Link as MuiLink } from '@mui/material';
import { login } from '../api/authApi';
import { useAppDispatch } from '../store';
import { loginSuccess } from '../slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      navigate('/home');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleLogin}>
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
            Login
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          <MuiLink component={Link} to="/register">
            Don't have an account? Register
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
