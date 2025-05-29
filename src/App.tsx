import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import PlaylistDetails from './pages/PlaylistDetails';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
        path="/playlist/:id"
        element={
          <ProtectedRoute>
            <PlaylistDetails />
          </ProtectedRoute>
        }
      />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
