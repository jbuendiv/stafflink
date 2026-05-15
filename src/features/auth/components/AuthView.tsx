import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../../../services/firebase';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';

export function AuthView() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden');
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f3f4f6' }}>
      <Paper elevation={0} sx={{ p: 4, width: '100%', maxWidth: 400, borderRadius: 3, border: '1px solid #e5e7eb' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827', mb: 1 }}>
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            STAFFLINK
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleAuth}>
          <TextField
            fullWidth
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            size="small"
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            size="small"
          />
          {!isLogin && (
            <TextField
              fullWidth
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
              required
              size="small"
            />
          )}
          <Button 
            fullWidth 
            type="submit" 
            variant="contained" 
            sx={{ 
              mt: 2, 
              bgcolor: '#6366f1', 
              '&:hover': { bgcolor: '#4f46e5' },
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 2,
              py: 1
            }}
          >
            {isLogin ? 'Ingresar' : 'Registrarse'}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="text" 
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setConfirmPassword('');
            }}
            sx={{ textTransform: 'none', color: '#6366f1', fontWeight: 600 }}
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
