import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

export default function StatisticsPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Statistiques
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
        Analyses et rapports détaillés
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              Graphiques et statistiques détaillées
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








