const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Charger les variables d'environnement
dotenv.config();

// Importer les routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const pharmacyRoutes = require('./routes/pharmacy.routes');
const orderRoutes = require('./routes/order.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const googleMapsRoutes = require('./routes/googleMaps.routes');

// Initialiser l'application
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rendre io accessible dans les routes
app.set('io', io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pharmacies', pharmacyRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/google-maps', googleMapsRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API PharmaLivraison Abidjan 🏥',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      pharmacies: '/api/pharmacies',
      orders: '/api/orders',
      deliveries: '/api/deliveries',
      googleMaps: '/api/google-maps'
    }
  });
});

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Socket.io pour le temps réel
io.on('connection', (socket) => {
  console.log('Nouvelle connexion Socket.io:', socket.id);

  // Rejoindre une room pour les mises à jour de commande
  socket.on('join-order', (orderId) => {
    socket.join(`order-${orderId}`);
    console.log(`Socket ${socket.id} a rejoint la room order-${orderId}`);
  });

  // Mise à jour de position du livreur
  socket.on('update-location', (data) => {
    socket.to(`order-${data.orderId}`).emit('delivery-location', {
      location: data.location,
      deliveryId: data.deliveryId
    });
  });

  socket.on('disconnect', () => {
    console.log('Déconnexion Socket.io:', socket.id);
  });
});

// Connexion à MongoDB
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmalivraison';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📍 Host: 0.0.0.0 (accessible depuis émulateur)`);
      console.log(`📍 Environnement: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erreur de connexion à MongoDB:', error);
    process.exit(1);
  });

module.exports = { app, io };



