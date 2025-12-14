import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function PharmaciesPage() {
  const { API_URL } = useAuth();
  const [pharmacies, setPharmacies] = useState([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPharmacies();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = pharmacies.filter(
        (pharmacy) =>
          pharmacy.nom?.toLowerCase().includes(search.toLowerCase()) ||
          pharmacy.commune?.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPharmacies(filtered);
    } else {
      setFilteredPharmacies(pharmacies);
    }
  }, [search, pharmacies]);

  const fetchPharmacies = async () => {
    try {
      const response = await axios.get(`${API_URL}/pharmacies`);
      setPharmacies(response.data.data || []);
      setFilteredPharmacies(response.data.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des pharmacies');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Pharmacies
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {filteredPharmacies.length} pharmacie(s) à Abidjan
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Rechercher par nom ou commune..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Grid container spacing={3}>
        {filteredPharmacies.map((pharmacy) => (
          <Grid item xs={12} md={6} lg={4} key={pharmacy._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" component="h2" fontWeight="bold">
                    {pharmacy.nom}
                  </Typography>
                  <IconButton size="small" color="primary">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  📍 {pharmacy.adresse}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  📞 {pharmacy.telephone}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label={pharmacy.commune}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  {pharmacy.ouvert24h && (
                    <Chip label="24h/24" size="small" color="success" />
                  )}
                  {pharmacy.deGarde && (
                    <Chip label="De Garde" size="small" color="warning" />
                  )}
                  {pharmacy.verification?.verifie ? (
                    <Chip
                      icon={<CheckIcon />}
                      label="Vérifiée"
                      size="small"
                      color="success"
                    />
                  ) : (
                    <Chip
                      icon={<CancelIcon />}
                      label="Non vérifiée"
                      size="small"
                      color="error"
                    />
                  )}
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    ⭐ {pharmacy.note?.toFixed(1) || '5.0'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {pharmacy.nombreCommandes || 0} commandes
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








