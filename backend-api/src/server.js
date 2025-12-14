require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
let { users, pharmacies, medications, orders, deliveries, transactions, notifications } = require('./data');

// Services
const dispatchService = require('./services/dispatchService');
const courierSimulator = require('./services/courierSimulator');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Servir les fichiers statiques (admin pages)

// Attacher Socket.IO à l'app Express pour que les routes y accèdent
app.set('io', io);

// =====================================================
// MIDDLEWARE D'AUTHENTIFICATION
// =====================================================
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token manquant' });
  }

  try {
    const decoded = jwt.sign(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

// =====================================================
// ROUTE PRINCIPALE
// =====================================================
app.get('/', (req, res) => {
  res.json({ 
    message: '🏥 PharmaLivraison API', 
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      pharmacies: {
        list: 'GET /api/pharmacies',
        detail: 'GET /api/pharmacies/:id',
        search: 'GET /api/pharmacies/search'
      },
      medications: {
        list: 'GET /api/medications',
        byPharmacy: 'GET /api/medications/pharmacy/:pharmacyId'
      },
      orders: {
        list: 'GET /api/orders',
        create: 'POST /api/orders',
        detail: 'GET /api/orders/:id',
        updateStatus: 'PUT /api/orders/:id/status'
      },
      deliveries: {
        list: 'GET /api/deliveries',
        updateLocation: 'PUT /api/deliveries/:id/location',
        accept: 'POST /api/deliveries/:id/accept',
        complete: 'POST /api/deliveries/:id/complete'
      },
      wallet: {
        balance: 'GET /api/wallet/balance',
        transactions: 'GET /api/wallet/transactions',
        withdraw: 'POST /api/wallet/withdraw'
      },
      notifications: {
        list: 'GET /api/notifications',
        markRead: 'PUT /api/notifications/:id/read'
      }
    }
  });
});

// =====================================================
// HEALTH CHECK
// =====================================================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend PharmaLivraison opérationnel',
    timestamp: new Date(),
    stats: {
      users: users.length,
      pharmacies: pharmacies.length,
      medications: medications.length,
      orders: orders.length,
      deliveries: deliveries.length
    }
  });
});

// =====================================================
// ROUTES DISPATCH (Statistiques)
// =====================================================
app.get('/api/dispatch/stats', (req, res) => {
  const stats = dispatchService.getStats();
  res.json(stats);
});

// =====================================================
// ROUTES GOOGLE MAPS API (Proxy)
// =====================================================

const axios = require('axios');
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Service Places pour pharmacies réelles
const placesService = require('./services/placesService');

// Route: Calculer l'itinéraire avec Google Directions API
app.get('/api/google-maps/directions', async (req, res) => {
  try {
    const { origin, destination, mode = 'driving', departure_time = 'now' } = req.query;
    
    if (!origin || !destination) {
      return res.status(400).json({ 
        success: false, 
        message: 'Paramètres origin et destination requis' 
      });
    }
    
    if (!GOOGLE_MAPS_API_KEY) {
      return res.status(500).json({ 
        success: false,
        message: 'Clé API Google Maps non configurée'
      });
    }

    const url = `https://maps.googleapis.com/maps/api/directions/json?` +
      `origin=${origin}&` +
      `destination=${destination}&` +
      `mode=${mode}&` +
      `departure_time=${departure_time}&` +
      `key=${GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(url);
    
    if (response.data.status !== 'OK') {
      return res.status(400).json({
        success: false,
        message: `Erreur Google Maps: ${response.data.status}`
      });
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];
    
    // Extraire les coordonnées de la polyline
    const polyline = decodePolyline(route.overview_polyline.points);
    
    res.json({
      success: true,
      route: {
        polyline,
        distance: {
          text: leg.distance.text,
          value: leg.distance.value
        },
        duration: {
          text: leg.duration.text,
          value: leg.duration.value
        },
        duration_in_traffic: leg.duration_in_traffic ? {
          text: leg.duration_in_traffic.text,
          value: leg.duration_in_traffic.value
        } : null,
        start_address: leg.start_address,
        end_address: leg.end_address,
        steps: leg.steps.map(step => ({
          instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
          distance: step.distance.text,
          duration: step.duration.text,
          start_location: step.start_location,
          end_location: step.end_location
        }))
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur Google Directions API:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Fonction pour décoder la polyline Google Maps
function decodePolyline(encoded) {
  if (!encoded) return [];
  
  const poly = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b;
    let shift = 0;
    let result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    
    const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    poly.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return poly;
}

// ==============================================
// ROUTES AUTHENTIFICATION
// =====================================================

// LOGIN
app.post('/api/auth/login', (req, res) => {
  console.log('');
  console.log('========================================');
  console.log('📥 REQUETE LOGIN RECUE');
  console.log('========================================');
  console.log('Body:', req.body);
  
  const { phone, email, password } = req.body;
  
  // Validation
  if (!password || (!phone && !email)) {
    console.log('❌ Données manquantes');
    return res.status(400).json({ 
      success: false,
      message: 'Veuillez fournir un téléphone/email et un mot de passe' 
    });
  }
  
  console.log('🔍 Recherche utilisateur:', { phone, email });
  
  // Recherche utilisateur (supporter phone et email)
  const user = users.find(u => {
    if (phone) {
      const cleanPhone1 = phone.replace(/\s/g, '');
      const cleanPhone2 = u.phone.replace(/\s/g, '');
      if (cleanPhone1 === cleanPhone2) return true;
    }
    if (email && u.email === email) return true;
    return false;
  });
  
  console.log('👤 Utilisateur:', user ? `${user.firstName} ${user.lastName} (${user.role})` : 'Non trouvé');
  
  if (!user) {
    console.log('❌ Utilisateur non trouvé');
    return res.status(401).json({ 
      success: false,
      message: 'Identifiants incorrects' 
    });
  }
  
  if (password !== user.password) {
    console.log('❌ Mot de passe incorrect');
    return res.status(401).json({ 
      success: false,
      message: 'Identifiants incorrects' 
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, phone: user.phone, role: user.role },
    process.env.JWT_SECRET || 'secret-dev-key',
    { expiresIn: '7d' }
  );

  console.log('✅ Connexion réussie:', user.role);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      ...(user.role === 'driver' && {
        isAvailable: user.isAvailable,
        rating: user.rating,
        totalDeliveries: user.totalDeliveries,
        earnings: user.earnings,
        level: user.level,
        vehicle: user.vehicle
      })
    }
  });
});

// REGISTER
app.post('/api/auth/register', (req, res) => {
  const { firstName, lastName, email, phone, password, role } = req.body;
  
  // Vérifier si l'utilisateur existe
  const existingUser = users.find(u => u.email === email || u.phone === phone);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Cet email ou téléphone est déjà utilisé'
    });
  }
  
  const newUser = {
    id: String(users.length + 1),
    firstName,
    lastName,
    email,
    phone,
    password,
    role: role || 'client',
    location: null,
    avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
  };
  
  users.push(newUser);
  
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, phone: newUser.phone, role: newUser.role },
    process.env.JWT_SECRET || 'secret-dev-key',
    { expiresIn: '7d' }
  );
  
  res.status(201).json({
    success: true,
    token,
    user: {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      avatar: newUser.avatar
    }
  });
});

// =====================================================
// ROUTES PHARMACIES
// =====================================================

// Liste des pharmacies (données réelles Google Places)
app.get('/api/pharmacies', async (req, res) => {
  try {
    const { search, isOpen, is24h, isOnGuard, lat, lng, radius, useRealData } = req.query;
    
    // Si useRealData=true, utiliser Google Places API
    if (useRealData === 'true') {
      const latitude = lat ? parseFloat(lat) : 5.3600;
      const longitude = lng ? parseFloat(lng) : -4.0083;
      
      console.log(`🔍 Recherche pharmacies réelles (lat: ${latitude}, lng: ${longitude})`);
      const searchRadius = radius ? parseInt(radius, 10) : undefined; // en mètres
      const result = await placesService.getNearbyPharmacies(latitude, longitude, searchRadius);
      
      if (!result.success) {
        // Fallback sur données locales en cas d'erreur
        console.warn('⚠️ Fallback sur données locales');
        return res.json({ success: true, pharmacies: pharmacies, source: 'local' });
      }
      
      // Filtrer selon les critères
      let results = result.pharmacies;
      
      if (search) {
        results = results.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.address.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      if (isOpen === 'true') {
        results = results.filter(p => p.isOpen);
      }
      
      if (isOnGuard === 'true') {
        results = results.filter(p => p.isDeGarde);
      }
      
      return res.json({ 
        success: true, 
        pharmacies: results, 
        total: results.length,
        source: 'google_places' 
      });
    }
    
    // Sinon, utiliser les données locales (comportement par défaut)
    let results = [...pharmacies];
    
    if (search) {
      results = results.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.address.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (isOpen === 'true') {
      results = results.filter(p => p.isOpen);
    }
    
    if (is24h === 'true') {
      results = results.filter(p => p.is24h);
    }
    
    if (isOnGuard === 'true') {
      results = results.filter(p => p.isOnGuard);
    }
    
    res.json({ success: true, pharmacies: results, source: 'local' });
  } catch (error) {
    console.error('❌ Erreur liste pharmacies:', error);
    // Fallback sur données locales
    res.json({ success: true, pharmacies: pharmacies, source: 'local' });
  }
});

// Détail d'une pharmacie (Google Places ou local)
app.get('/api/pharmacies/:id', async (req, res) => {
  try {
    // Si l'ID ressemble à un place_id Google (commence par ChIJ ou similaire)
    if (req.params.id.length > 20) {
      console.log(`🔍 Récupération détails pharmacie Google: ${req.params.id}`);
      const result = await placesService.getPharmacyDetails(req.params.id);
      
      if (result.success) {
        return res.json({
          success: true,
          pharmacy: result.pharmacy,
          source: 'google_places'
        });
      }
    }
    
    // Sinon recherche locale
    const pharmacy = pharmacies.find(p => p.id === req.params.id);
    
    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacie non trouvée'
      });
    }
    
    // Ajouter les médicaments de cette pharmacie
    const pharmacyMedications = medications.filter(m => m.pharmacyId === pharmacy.id);
    
    res.json({
      success: true,
      pharmacy: {
        ...pharmacy,
        medications: pharmacyMedications
      },
      source: 'local'
    });
  } catch (error) {
    console.error('❌ Erreur détail pharmacie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// =====================================================
// ROUTES MÉDICAMENTS
// =====================================================

// Liste des médicaments
app.get('/api/medications', (req, res) => {
  const { search, category, requiresPrescription } = req.query;
  
  let results = [...medications];
  
  if (search) {
    results = results.filter(m => 
      m.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    results = results.filter(m => m.category === category);
  }
  
  if (requiresPrescription) {
    results = results.filter(m => m.requiresPrescription === (requiresPrescription === 'true'));
  }
  
  res.json({ success: true, medications: results });
});

// Médicaments d'une pharmacie
app.get('/api/medications/pharmacy/:pharmacyId', (req, res) => {
  const pharmacyMedications = medications.filter(m => m.pharmacyId === req.params.pharmacyId);
  
  res.json({ success: true, medications: pharmacyMedications });
});

// =====================================================
// ROUTES COMMANDES
// =====================================================

// Liste des commandes
app.get('/api/orders', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-dev-key');
    let userOrders = [...orders];
    
    if (decoded.role === 'client') {
      userOrders = orders.filter(o => o.clientId === decoded.id);
    } else if (decoded.role === 'driver') {
      userOrders = orders.filter(o => o.livreurId === decoded.id || o.status === 'pending');
    } else if (decoded.role === 'pharmacist') {
      const pharmacist = users.find(u => u.id === decoded.id);
      userOrders = orders.filter(o => o.pharmacyId === pharmacist.pharmacyId);
    }

    res.json({ success: true, orders: userOrders });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
});

// Détail d'une commande (par id ou orderNumber)
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Commande non trouvée'
    });
  }
  
  // Enrichir avec les infos
  const client = users.find(u => u.id === order.clientId);
  const pharmacy = pharmacies.find(p => p.id === order.pharmacyId);
  const livreur = order.livreurId ? users.find(u => u.id === order.livreurId) : null;
  
  res.json({
    success: true,
    order: {
      ...order,
      client: client ? {
        name: `${client.firstName} ${client.lastName}`,
        phone: client.phone,
        avatar: client.avatar
      } : null,
      pharmacy: pharmacy ? {
        name: pharmacy.name,
        phone: pharmacy.phone,
        address: pharmacy.address
      } : null,
      livreur: livreur ? {
        name: `${livreur.firstName} ${livreur.lastName}`,
        phone: livreur.phone,
        avatar: livreur.avatar,
        rating: livreur.rating,
        vehicle: livreur.vehicle
      } : null
    }
  });
});

// Créer une commande
app.post('/api/orders', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-dev-key');
    
    // Si aucune pharmacie n'est fournie, en sélectionner une automatiquement
    let pharmacyData = {
      pharmacyId: req.body.pharmacyId,
      pharmacyName: req.body.pharmacyName,
      pharmacyAddress: req.body.pharmacyAddress,
      pharmacyLocation: req.body.pharmacyLocation
    };

    // Sélection automatique de pharmacie si non fournie
    if (!pharmacyData.pharmacyLocation && (req.body.deliveryLocation || req.body.clientLocation)) {
      const clientLoc = req.body.deliveryLocation || req.body.clientLocation;
      console.log('🔍 Aucune pharmacie sélectionnée, recherche automatique...');
      
      // Émettre début de recherche de pharmacie
      io.emit('pharmacy:search-started', { 
        clientLocation: clientLoc
      });
      
      // Recherche en cascade avec rayons croissants (10km → 12km → 15km)
      const searchRadii = [10000, 12000, 15000]; // en mètres
      let selectedPharmacy = null;
      
      for (const radius of searchRadii) {
        console.log(`   📡 Recherche dans un rayon de ${radius / 1000} km...`);
        
        // Émettre progression de recherche
        io.emit('pharmacy:search-progress', {
          radius: radius / 1000,
          clientLocation: clientLoc
        });
        
        try {
          const result = await placesService.searchPharmacies(
            clientLoc.lat, 
            clientLoc.lng, 
            radius,
            'pharmacy'
          );
          
          if (result.success && result.pharmacies && result.pharmacies.length > 0) {
            // IMPORTANT : Filtrer UNIQUEMENT les pharmacies OUVERTES
            const openPharmacies = result.pharmacies.filter(p => p.isOpen);
            
            if (openPharmacies.length > 0) {
              selectedPharmacy = openPharmacies[0]; // Prendre la première pharmacie ouverte
              console.log(`   ✅ Pharmacie ouverte trouvée à ${radius / 1000} km`);
              
              // Émettre pharmacie trouvée
              io.emit('pharmacy:found', {
                pharmacy: {
                  name: selectedPharmacy.name,
                  address: selectedPharmacy.address || selectedPharmacy.vicinity,
                  location: selectedPharmacy.location
                },
                radius: radius / 1000
              });
              
              break; // Arrêter la recherche
            } else {
              console.log(`   ⚠️ ${result.pharmacies.length} pharmacie(s) trouvée(s) mais toutes fermées`);
            }
          } else {
            console.log(`   ⚠️ Aucune pharmacie trouvée dans ce rayon`);
          }
        } catch (error) {
          console.warn(`   ❌ Erreur recherche à ${radius / 1000} km:`, error.message);
        }
        
        // Délai entre chaque recherche pour l'animation
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Si aucune pharmacie ouverte trouvée après toutes les tentatives
      if (!selectedPharmacy) {
        // Fallback ultime : données locales
        const fallbackLocal = pharmacies.find(p => p.isOpen) || pharmacies[0];
        if (fallbackLocal) {
          console.warn('⚠️ Aucune pharmacie Google ouverte, fallback sur données locales');
          selectedPharmacy = {
            id: fallbackLocal.id,
            place_id: fallbackLocal.id,
            name: fallbackLocal.name,
            address: fallbackLocal.address,
            location: fallbackLocal.location,
            isOpen: fallbackLocal.isOpen !== false // considérer ouverte si info absente
          };
        } else {
          console.error('❌ AUCUNE PHARMACIE OUVERTE TROUVÉE dans un rayon de 15 km');
          return res.status(400).json({ 
            success: false, 
            message: 'Aucune pharmacie ouverte trouvée dans votre zone. Veuillez réessayer plus tard ou sélectionner manuellement une pharmacie.',
            error: 'NO_OPEN_PHARMACY'
          });
        }
      }
      
      // Pharmacie ouverte trouvée !
      pharmacyData = {
        pharmacyId: selectedPharmacy.id || selectedPharmacy.place_id,
        pharmacyName: selectedPharmacy.name,
        pharmacyAddress: selectedPharmacy.address || selectedPharmacy.vicinity,
        pharmacyLocation: {
          lat: selectedPharmacy.location.lat,
          lng: selectedPharmacy.location.lng
        }
      };
      
      console.log(`✅ Pharmacie auto-sélectionnée: ${pharmacyData.pharmacyName}`);
      console.log(`   ${pharmacyData.pharmacyAddress}`);
      console.log(`   🟢 OUVERTE - Prête pour la livraison`);
    }
    
    const newOrder = {
      id: String(orders.length + 1),
      orderNumber: 'CMD' + String(orders.length + 1).padStart(3, '0'),
      clientId: decoded.id,
      ...req.body,
      ...pharmacyData, // Intégrer les données de pharmacie (auto ou manuelle)
      status: 'pending',
      createdAt: new Date()
    };
    
    orders.push(newOrder);
    
    console.log('');
    console.log('========================================');
    console.log('📦 NOUVELLE COMMANDE REÇUE');
    console.log('========================================');
    console.log('Numéro:', newOrder.orderNumber);
    console.log('Client:', decoded.phone);
    console.log('Pharmacie:', pharmacyData.pharmacyName || 'Non définie');
    console.log('');
    
    // DISPATCH AUTOMATIQUE vers le meilleur livreur
    if (req.body.deliveryLocation || req.body.clientLocation) {
      const orderForDispatch = {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        clientName: decoded.firstName + ' ' + decoded.lastName,
        clientPhone: decoded.phone,
        clientAddress: req.body.deliveryAddress,
        clientLocation: req.body.deliveryLocation || req.body.clientLocation,
        pharmacyName: pharmacyData.pharmacyName,
        pharmacyAddress: pharmacyData.pharmacyAddress,
        pharmacyLocation: pharmacyData.pharmacyLocation,
        medications: req.body.medications,
        orderType: req.body.orderType,
        medicationList: req.body.medicationList,
        symptoms: req.body.symptoms,
        notes: req.body.notes,
        totalPrice: req.body.totalPrice || 0,
        deliveryFee: req.body.deliveryFee || 1000,
        isUrgent: req.body.isUrgent || false,
        forOther: req.body.forOther || false
      };
      
      const dispatchResult = await dispatchService.dispatchOrder(orderForDispatch, io);
      
      if (dispatchResult.success) {
        console.log('✅ Commande dispatchée avec succès');
        console.log(`   Livreur: ${dispatchResult.courier.firstName} ${dispatchResult.courier.lastName}`);
        console.log(`   Distance: ${dispatchResult.distance} km`);
        console.log(`   ETA: ${dispatchResult.estimatedTime} min`);
      } else {
        console.log('⚠️ Dispatch échoué:', dispatchResult.message);
        // Fallback: notifier tous les livreurs
        io.emit('new:order', newOrder);
      }
    } else {
      // Pas de position: broadcast à tous
      io.emit('new:order', newOrder);
    }
    
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error('❌ Erreur création commande:', error);
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
});

// Mettre à jour le statut d'une commande
app.put('/api/orders/:id/status', (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Commande non trouvée'
    });
  }
  
  const { status } = req.body;
  order.status = status;
  
  if (status === 'accepted') {
    order.acceptedAt = new Date();
  } else if (status === 'delivered') {
    order.deliveredAt = new Date();
  }
  
  // Notifier via Socket.IO
  io.emit(`order:${order.id}:status`, { orderId: order.id, status });
  
  // Notifier le client
  const notification = {
    id: String(notifications.length + 1),
    userId: order.clientId,
    title: 'Mise à jour commande',
    message: `Votre commande ${order.orderNumber} est ${status}`,
    type: 'order',
    isRead: false,
    createdAt: new Date()
  };
  notifications.push(notification);
  io.to(order.clientId).emit('new:notification', notification);
  
  res.json({ success: true, order });
});

// =====================================================
// ROUTES LIVRAISONS
// =====================================================

// Liste des livraisons
app.get('/api/deliveries', (req, res) => {
  res.json({ success: true, deliveries });
});

// Accepter une livraison
app.post('/api/deliveries/:id/accept', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-dev-key');
    
    // Chercher par ID ou par orderNumber
    const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
    
    if (!order) {
      console.log('❌ Commande non trouvée:', req.params.id);
      console.log('   Commandes disponibles:', orders.map(o => ({ id: o.id, orderNumber: o.orderNumber })));
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }
    
    order.livreurId = decoded.id;
    order.status = 'accepted';
    order.acceptedAt = new Date();
    
    const newDelivery = {
      id: String(deliveries.length + 1),
      orderId: order.id,
      orderNumber: order.orderNumber,
      livreurId: decoded.id,
      status: 'accepted',
      currentLocation: order.pharmacyLocation,
      startLocation: order.pharmacyLocation,
      endLocation: order.deliveryLocation,
      pharmacyName: order.pharmacyName || 'Pharmacie',
      pharmacyAddress: order.pharmacyAddress || 'Non spécifié',
      pharmacyLocation: order.pharmacyLocation,
      clientAddress: order.clientAddress || order.deliveryAddress,
      clientLocation: order.deliveryLocation,
      estimatedTime: order.estimatedDeliveryTime,
      distance: 0,
      startedAt: new Date(),
      completedAt: null
    };
    
    deliveries.push(newDelivery);
    
    console.log(`📡 [BACKEND] Émission événements d'acceptation - Commande ${order.id}`);
    
    // Émettre événement spécifique à la commande
    io.emit(`order:${order.id}:accepted`, { orderId: order.id, livreurId: decoded.id });
    
    // Émettre événement global pour le client
    io.emit('order:accepted', { 
      orderId: order.id, 
      orderNumber: order.orderNumber,
      livreurId: decoded.id,
      clientId: order.clientId
    });
    
    console.log(`✅ [BACKEND] Événements émis avec succès`);
    
    res.json({ success: true, delivery: newDelivery, order });
  } catch (error) {
    console.error('❌ Erreur acceptation:', error);
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
});

// Démarrer la livraison (partir vers la pharmacie)
app.put('/api/deliveries/:id/start', (req, res) => {
  const delivery = deliveries.find(d => d.orderId === req.params.id);
  
  if (!delivery) {
    return res.status(404).json({
      success: false,
      message: 'Livraison non trouvée'
    });
  }
  
  delivery.status = 'to-pharmacy';
  const order = orders.find(o => o.id === delivery.orderId);
  if (order) {
    order.status = 'to-pharmacy';
  }
  
  io.emit(`delivery:${delivery.orderId}:status`, { orderId: delivery.orderId, status: 'to-pharmacy' });
  
  res.json({ success: true, delivery, order });
});

// Arriver à la pharmacie
app.put('/api/deliveries/:id/arrive-pharmacy', (req, res) => {
  const delivery = deliveries.find(d => d.orderId === req.params.id);
  
  if (!delivery) {
    return res.status(404).json({
      success: false,
      message: 'Livraison non trouvée'
    });
  }
  
  delivery.status = 'at-pharmacy';
  const order = orders.find(o => o.id === delivery.orderId);
  if (order) {
    order.status = 'at-pharmacy';
  }
  
  io.emit(`delivery:${delivery.orderId}:status`, { orderId: delivery.orderId, status: 'at-pharmacy' });
  
  res.json({ success: true, delivery, order });
});

// Récupérer les médicaments
app.put('/api/deliveries/:id/pickup', (req, res) => {
  const delivery = deliveries.find(d => d.orderId === req.params.id);
  
  if (!delivery) {
    return res.status(404).json({
      success: false,
      message: 'Livraison non trouvée'
    });
  }
  
  delivery.status = 'to-client';
  const order = orders.find(o => o.id === delivery.orderId);
  if (order) {
    order.status = 'to-client';
  }
  
  io.emit(`delivery:${delivery.orderId}:status`, { orderId: delivery.orderId, status: 'to-client' });
  
  res.json({ success: true, delivery, order });
});

// Mettre à jour la position du livreur
app.put('/api/deliveries/:id/location', (req, res) => {
  const delivery = deliveries.find(d => d.id === req.params.id);
  
  if (!delivery) {
    return res.status(404).json({
      success: false,
      message: 'Livraison non trouvée'
    });
  }
  
  delivery.currentLocation = req.body;
  delivery.status = 'delivering';
  
  // Notifier via Socket.IO
  io.emit(`delivery:${delivery.orderId}:location`, req.body);
  
  // Mettre à jour la commande
  const order = orders.find(o => o.id === delivery.orderId);
  if (order) {
    order.status = 'delivering';
  }
  
  res.json({ success: true, delivery });
});

// Terminer une livraison (accepte deliveryId, orderId ou orderNumber)
app.post('/api/deliveries/:id/complete', (req, res) => {
  const delivery = deliveries.find(d => 
    d.id === req.params.id ||
    d.orderId === req.params.id ||
    d.orderNumber === req.params.id
  );
  
  if (!delivery) {
    return res.status(404).json({
      success: false,
      message: 'Livraison non trouvée'
    });
  }
  
  delivery.status = 'completed';
  delivery.completedAt = new Date();
  
  const order = orders.find(o => o.id === delivery.orderId);
  if (order) {
    order.status = 'delivered';
    order.deliveredAt = new Date();
    
    // Ajouter une transaction au portefeuille du livreur
    const deliveryFee = order.deliveryFee * 0.8; // 80% pour le livreur
    const transaction = {
      id: String(transactions.length + 1),
      userId: delivery.livreurId,
      type: 'earning',
      amount: deliveryFee,
      description: `Livraison ${order.orderNumber}`,
      date: new Date(),
      status: 'completed'
    };
    transactions.push(transaction);
    
    // Mettre à jour les gains du livreur
    const driver = users.find(u => u.id === delivery.livreurId);
    if (driver) {
      driver.earnings = (driver.earnings || 0) + deliveryFee;
      driver.totalDeliveries = (driver.totalDeliveries || 0) + 1;
    }
  }
  
  io.emit(`delivery:${delivery.orderId}:completed`, { deliveryId: delivery.id });
  
  res.json({ success: true, delivery, order });
});

// =====================================================
// ROUTES PORTEFEUILLE
// =====================================================

// Balance du portefeuille
app.get('/api/wallet/balance', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-dev-key');
    const user = users.find(u => u.id === decoded.id);
    
    if (!user || user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }
    
    res.json({
      success: true,
      balance: user.earnings || 0,
      totalDeliveries: user.totalDeliveries || 0,
      level: user.level || 'Bronze'
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
});

// Transactions du portefeuille
app.get('/api/wallet/transactions', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-dev-key');
    const userTransactions = transactions.filter(t => t.userId === decoded.id);
    
    res.json({
      success: true,
      transactions: userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
});

// Demande de retrait
app.post('/api/wallet/withdraw', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-dev-key');
    const user = users.find(u => u.id === decoded.id);
    
    if (!user || user.role !== 'driver') {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé'
      });
    }
    
    const { amount, method } = req.body;
    
    if (amount > user.earnings) {
      return res.status(400).json({
        success: false,
        message: 'Solde insuffisant'
      });
    }
    
    const transaction = {
      id: String(transactions.length + 1),
      userId: user.id,
      type: 'withdrawal',
      amount: -amount,
      description: `Retrait ${method}`,
      date: new Date(),
      status: 'pending'
    };
    
    transactions.push(transaction);
    user.earnings -= amount;
    
    res.json({
      success: true,
      transaction,
      newBalance: user.earnings
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
});

// =====================================================
// ROUTES NOTIFICATIONS
// =====================================================

// Liste des notifications
app.get('/api/notifications', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-dev-key');
    const userNotifications = notifications
      .filter(n => n.userId === decoded.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({
      success: true,
      notifications: userNotifications
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token invalide' });
  }
});

// Marquer une notification comme lue
app.put('/api/notifications/:id/read', (req, res) => {
  const notification = notifications.find(n => n.id === req.params.id);
  
  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification non trouvée'
    });
  }
  
  notification.isRead = true;
  
  res.json({ success: true, notification });
});

// =====================================================
// SOCKET.IO - TEMPS RÉEL
// =====================================================
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('✅ Client connecté:', socket.id);

  // Enregistrer l'utilisateur
  socket.on('user:register', (data) => {
    connectedUsers.set(data.userId, socket.id);
    socket.join(data.userId);
    console.log(`👤 User ${data.userId} joined room`);
  });

  // Position du livreur
  socket.on('driver:location', (data) => {
    console.log('📍 Driver location:', data);
    
    // Mettre à jour la livraison
    const delivery = deliveries.find(d => d.livreurId === data.driverId && d.status !== 'completed');
    if (delivery) {
      delivery.currentLocation = data.location;
      
      // Notifier le client de la commande
      const order = orders.find(o => o.id === delivery.orderId);
      if (order) {
        io.to(order.clientId).emit('location:update', {
          orderId: order.id,
          location: data.location,
          estimatedTime: data.estimatedTime || delivery.estimatedTime
        });
      }
    }
    
    // Broadcast à tous les autres
    socket.broadcast.emit('location:update', data);
  });

  // Nouvelle version: driver-location-update (utilisée par les apps)
  socket.on('driver-location-update', (data) => {
    console.log('📍 [BACKEND] Position livreur reçue:', data);
    
    // Retransmettre à TOUS les clients connectés
    io.emit('driver-location-update', data);
    console.log('📡 [BACKEND] Position retransmise aux clients');
  });

  // Nouveau message
  socket.on('message:send', (data) => {
    const { orderId, senderId, message } = data;
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
      // Envoyer au client
      io.to(order.clientId).emit('message:received', data);
      
      // Envoyer au livreur
      if (order.livreurId) {
        io.to(order.livreurId).emit('message:received', data);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client déconnecté:', socket.id);
    
    // Retirer de la map
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// =====================================================
// DÉMARRAGE DU SERVEUR
// =====================================================
const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('========================================');
  console.log(`🚀 PHARMALIVRAISON API DÉMARRÉE`);
  console.log('========================================');
  console.log('');
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`📡 LAN: http://192.168.1.5:${PORT}`);
  console.log('🔌 Socket.IO: actif');
  console.log('');
  console.log('📊 STATISTIQUES:');
  console.log(`   👥 Utilisateurs: ${users.length}`);
  console.log(`   🏥 Pharmacies: ${pharmacies.length}`);
  console.log(`   💊 Médicaments: ${medications.length}`);
  console.log(`   📦 Commandes: ${orders.length}`);
  console.log(`   🚚 Livraisons: ${deliveries.length}`);
  console.log('');
  console.log(`🔗 Test: http://localhost:${PORT}/api/health`);
  console.log('');
  
  // Démarrer le simulateur de livreurs
  courierSimulator.startSimulation();
});
