import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
} from '@mui/material';
import {
  TwoWheeler as BikeIcon,
  DirectionsCar as CarIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function DeliveriesPage() {
  const { API_URL } = useAuth();
  const [deliverers, setDeliverers] = useState([]);

  useEffect(() => {
    fetchDeliverers();
  }, []);

  const fetchDeliverers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      const allUsers = response.data.data || [];
      const livreurs = allUsers.filter((user) => user.role === 'livreur');
      setDeliverers(livreurs);
    } catch (error) {
      toast.error('Erreur lors du chargement des livreurs');
    }
  };

  const getVehicleIcon = (vehicule) => {
    if (vehicule === 'voiture') return <CarIcon />;
    return <BikeIcon />;
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Livreurs
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {deliverers.length} livreur(s) enregistré(s)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {deliverers.map((deliverer) => (
          <Grid item xs={12} md={6} lg={4} key={deliverer._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#FF6B35', mr: 2, width: 56, height: 56 }}>
                    {deliverer.prenom?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {deliverer.prenom} {deliverer.nom}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {deliverer.telephone}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {getVehicleIcon(deliverer.livreurInfo?.vehicule)}
                  <Typography variant="body2">
                    {deliverer.livreurInfo?.vehicule || 'Non spécifié'}
                  </Typography>
                  {deliverer.livreurInfo?.immatriculation && (
                    <Chip
                      label={deliverer.livreurInfo.immatriculation}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {deliverer.livreurInfo?.disponible ? (
                    <Chip label="Disponible" color="success" size="small" />
                  ) : (
                    <Chip label="Indisponible" color="default" size="small" />
                  )}
                  {deliverer.livreurInfo?.documentsVerifies ? (
                    <Chip label="Vérifié" color="primary" size="small" />
                  ) : (
                    <Chip label="Non vérifié" color="warning" size="small" />
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ fontSize: 16, color: '#FFD700' }} />
                    <Typography variant="body2">
                      {deliverer.livreurInfo?.note?.toFixed(1) || '5.0'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {deliverer.livreurInfo?.nombreLivraisons || 0} livraisons
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}








