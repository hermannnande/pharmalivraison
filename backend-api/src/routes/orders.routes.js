const express = require('express');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Importer les données en mémoire
let { orders, users } = require('../data');

// @route POST /api/orders
router.post('/', auth, async (req, res) => {
  try {
    console.log('📥 [BACKEND] Création de commande:', req.body);
    console.log('📥 [BACKEND] User:', req.user);
    
    // Générer un vrai numéro de commande séquentiel
    const orderNumber = `#ORD-${String(orders.length + 1).padStart(5, '0')}`;
    
    // Créer la commande en mémoire
    const newOrder = {
      id: `order-${Date.now()}`,
      orderNumber,
      orderType: req.body.orderType,
      medicationList: req.body.medicationList || '',
      symptoms: req.body.symptoms || '',
      notes: req.body.notes || '',
      forOther: req.body.forOther || false,
      recipientName: req.body.recipientName || '',
      recipientPhone: req.body.recipientPhone || '',
      clientId: req.user.userId,
      pharmacyId: req.body.pharmacyId || '1',
      deliveryAddress: req.body.deliveryAddress,
      deliveryLocation: req.body.deliveryLocation,
      pharmacyLocation: req.body.pharmacyLocation,
      status: 'pending',
      livreurId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Ajouter aux données en mémoire
    orders.push(newOrder);

    console.log('✅ [BACKEND] Commande créée:', orderNumber);

    // Récupérer les infos du client
    const client = users.find(u => u.id === req.user.userId);
    const orderWithClient = {
      ...newOrder,
      client: client ? {
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        avatar: client.avatar
      } : null
    };

    // Émettre l'événement Socket.IO pour notifier les livreurs
    const io = req.app.get('io');
    if (io) {
      console.log('📡 [BACKEND] Émission événement Socket.IO: new:order');
      io.emit('new:order', orderWithClient);
      console.log('📡 [BACKEND] Événement émis avec succès');
    } else {
      console.warn('⚠️ [BACKEND] Socket.IO non disponible');
    }

    res.status(201).json({ success: true, order: orderWithClient });
  } catch (error) {
    console.error('❌ [BACKEND] Erreur création commande:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/orders
router.get('/', auth, async (req, res) => {
  try {
    const { role, userId } = req.user;
    let filteredOrders = orders;
    
    if (role === 'client') {
      filteredOrders = orders.filter(o => o.clientId === userId);
    } else if (role === 'driver' || role === 'livreur') {
      filteredOrders = orders.filter(o => o.livreurId === userId);
    }

    // Populer les infos client pour chaque commande
    const ordersWithDetails = filteredOrders.map(order => {
      const client = users.find(u => u.id === order.clientId);
      const livreur = order.livreurId ? users.find(u => u.id === order.livreurId) : null;
      
      return {
        ...order,
        client: client ? {
          firstName: client.firstName,
          lastName: client.lastName,
          phone: client.phone,
          avatar: client.avatar
        } : null,
        livreur: livreur ? {
          firstName: livreur.firstName,
          lastName: livreur.lastName,
          phone: livreur.phone,
          avatar: livreur.avatar
        } : null
      };
    });

    res.json({ success: true, orders: ordersWithDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/orders/:id/status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    }

    order.status = status;
    order.updatedAt = new Date().toISOString();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route PUT /api/orders/:id/assign
router.put('/:id/assign', auth, async (req, res) => {
  try {
    const { livreurId } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Commande non trouvée' });
    }

    order.livreurId = livreurId;
    order.status = 'assigned';
    order.updatedAt = new Date().toISOString();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;



