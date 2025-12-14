import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import {
  People as PeopleIcon,
  LocalPharmacy as PharmacyIcon,
  ShoppingCart as OrdersIcon,
  LocalShipping as DeliveryIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="textSecondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 2,
              backgroundColor: `${color}15`,
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { API_URL } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    pharmacies: 0,
    orders: 0,
    deliverers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, pharmaciesRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/pharmacies`),
        axios.get(`${API_URL}/orders`),
      ]);

      const allOrders = ordersRes.data.data || [];
      const deliverers = usersRes.data.data?.filter(u => u.role === 'livreur').length || 0;

      setStats({
        users: usersRes.data.count || 0,
        pharmacies: pharmaciesRes.data.count || 0,
        orders: allOrders.length,
        deliverers,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      const orders = response.data.data || [];
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    }
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

  if (loading) {
    return <Typography>Chargement...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Tableau de bord
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom sx={{ mb: 3 }}>
        Vue d'ensemble de PharmaLivraison Abidjan
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Utilisateurs"
            value={stats.users}
            icon={<PeopleIcon />}
            color="#00B386"
            subtitle="Clients, Livreurs, Pharmacies"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pharmacies"
            value={stats.pharmacies}
            icon={<PharmacyIcon />}
            color="#4ECDC4"
            subtitle="Pharmacies enregistrées"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Commandes"
            value={stats.orders}
            icon={<OrdersIcon />}
            color="#FF6B35"
            subtitle="Toutes les commandes"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Livreurs"
            value={stats.deliverers}
            icon={<DeliveryIcon />}
            color="#9b59b6"
            subtitle="Livreurs actifs"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Commandes Récentes
            </Typography>
            {recentOrders.length === 0 ? (
              <Typography color="textSecondary">Aucune commande récente</Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                {recentOrders.map((order) => (
                  <Box
                    key={order._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 2,
                      borderBottom: '1px solid #eee',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="500">
                        #{order.numeroCommande}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {order.description?.substring(0, 50)}...
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: order.statut === 'livre' ? '#e8f5e9' : '#fff3e0',
                          color: order.statut === 'livre' ? '#2e7d32' : '#e65100',
                          fontWeight: 500,
                        }}
                      >
                        {getStatusText(order.statut)}
                      </Typography>
                      <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 0.5 }}>
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}








