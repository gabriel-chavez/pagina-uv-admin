import React, { useState } from 'react';
import { login } from '@/services/authService';
import { useRouter } from 'next/router';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';

const LoginForm = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(user, password);
      if (token.exito) {
        router.push('/');
      }
    } catch (err) {
      setError(err.message || 'Error de inicio de sesión');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" align="center" sx={{ marginBottom: 3 }}>
          Iniciar sesión
        </Typography>
        <TextField
          label="Usuario"
          type="text"
          variant="outlined"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}
        <Button variant="contained" color="primary" type="submit" fullWidth sx={{ marginTop: 2 }}>
          Iniciar sesión
        </Button>
      </Box>
    </Container>
  );
};

export default LoginForm;
