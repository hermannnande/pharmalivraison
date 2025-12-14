import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

export default function SettingsPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Paramètres
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Configuration de l'application
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              Paramètres de l'application
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Fonctionnalité en cours de développement
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}








