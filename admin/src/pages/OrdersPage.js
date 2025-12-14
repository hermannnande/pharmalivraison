import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const { API_URL } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.statut === statusFilter);
    }

    if (search) {
      filtered = filtered.filter((order) =>
        order.numeroCommande?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [search, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      setOrders(response.data.data || []);
      setFilteredOrders(response.data.data || []);
    } catch (error) {
      toast.error('Erreur lors du chargement des commandes');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      en_attente: 'warning',
      livreur_assigne: 'info',
      en_route_pharmacie: 'primary',
      a_la_pharmacie: 'secondary',
      achat_en_cours: 'default',
      en_route_client: 'primary',
      livre: 'success',
      annulee: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const statusMap = {
      en_attente: 'En attente',
      livreur_assigne: 'Livreur assigné',
      en_route_pharmacie: 'En route pharmacie',
      a_la_pharmacie: 'À la pharmacie',
      achat_en_cours: 'Achat en cours',
      en_route_client: 'En livraison',
      livre: 'Livré',
      annulee: 'Annulée',
    };
    return statusMap[status] || status;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Commandes
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {filteredOrders.length} commande(s)
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par numéro de commande..."
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
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Statut</InputLabel>
            <Select
              value={statusFilter}
              label="Statut"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="en_attente">En attente</MenuItem>
              <MenuItem value="livreur_assigne">Livreur assigné</MenuItem>
              <MenuItem value="en_route_client">En livraison</MenuItem>
              <MenuItem value="livre">Livré</MenuItem>
              <MenuItem value="annulee">Annulée</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>N° Commande</strong></TableCell>
              <TableCell><strong>Client</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Statut</strong></TableCell>
              <TableCell><strong>Prix Total</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order._id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="500">
                    #{order.numeroCommande}
                  </Typography>
                </TableCell>
                <TableCell>
                  {order.client?.prenom} {order.client?.nom}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {order.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(order.statut)}
                    color={getStatusColor(order.statut)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {order.prix?.total > 0 ? `${order.prix.total} FCFA` : '-'}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary">
                    <ViewIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}








