import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { LocalHospital as HospitalIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(telephone, motDePasse);

    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #00B386 0%, #4ECDC4 100%)',
        padding: 2,
      }}
    >
      <Card sx={{ maxWidth: 450, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <HospitalIcon sx={{ fontSize: 64, color: '#00B386', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              PharmaLivraison
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Dashboard Administrateur
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Numéro de téléphone"
              variant="outlined"
              margin="normal"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="0707070707"
              required
            />

            <TextField
              fullWidth
              label="Mot de passe"
              type="password"
              variant="outlined"
              margin="normal"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                backgroundColor: '#00B386',
                '&:hover': {
                  backgroundColor: '#009970',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
            </Button>
          </form>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" display="block" gutterBottom>
              <strong>Compte Admin Test :</strong>
            </Typography>
            <Typography variant="caption" display="block">
              Téléphone : 0700000000
            </Typography>
            <Typography variant="caption" display="block">
              Mot de passe : admin123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}








