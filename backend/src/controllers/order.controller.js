const Order = require('../models/Order.model');
const User = require('../models/User.model');
const Pharmacy = require('../models/Pharmacy.model');
const cloudinary = require('../config/cloudinary');

// @desc    Créer une commande
// @route   POST /api/orders
// @access  Private (Client)
exports.createOrder = async (req, res) => {
  try {
    const {
      description,
      adresseLivraison,
      ordonnanceUrl,
      ordonnanceCloudinaryId
    } = req.body;

    // Calculer les frais de livraison (à améliorer avec calcul de distance)
    const fraisLivraison = parseInt(process.env.DEFAULT_DELIVERY_FEE) || 1000;

    const orderData = {
      client: req.user.id,
      description,
      adresseLivraison,
      prix: {
        livraison: fraisLivraison
      }
    };

    // Ajouter l'ordonnance si fournie
    if (ordonnanceUrl) {
      orderData.ordonnance = {
        url: ordonnanceUrl,
        cloudinaryId: ordonnanceCloudinaryId
      };
    }

    const order = await Order.create(orderData);

    // Notifier les livreurs disponibles via Socket.io
    const io = req.app.get('io');
    io.emit('nouvelle-commande', {
      orderId: order._id,
      client: {
        nom: req.user.nom,
        prenom: req.user.prenom
      },
      adresseLivraison: order.adresseLivraison,
      description: order.description
    });

    res.status(201).json({
      success: true,
      message: 'Commande créée avec succès',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la commande',
      error: error.message
    });
  }
};

// @desc    Obtenir toutes les commandes
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    let query = {};

    // Si client, voir uniquement ses commandes
    if (req.user.role === 'client') {
      query.client = req.user.id;
    }

    // Si livreur, voir uniquement ses livraisons
    if (req.user.role === 'livreur') {
      query.livreur = req.user.id;
    }

    const orders = await Order.find(query)
      .populate('client', 'nom prenom telephone')
      .populate('livreur', 'nom prenom telephone livreurInfo')
      .populate('pharmacie', 'nom adresse telephone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes',
      error: error.message
    });
  }
};

// @desc    Obtenir une commande par ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('client', 'nom prenom telephone adresse')
      .populate('livreur', 'nom prenom telephone livreurInfo')
      .populate('pharmacie', 'nom adresse telephone location');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier l'autorisation
    if (
      req.user.role === 'client' && order.client._id.toString() !== req.user.id ||
      req.user.role === 'livreur' && order.livreur && order.livreur._id.toString() !== req.user.id
    ) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Non autorisé à voir cette commande'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la commande',
      error: error.message
    });
  }
};

// @desc    Assigner un livreur à une commande
// @route   PUT /api/orders/:id/assign
// @access  Private (Livreur)
exports.assignDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    if (order.statut !== 'en_attente') {
      return res.status(400).json({
        success: false,
        message: 'Cette commande a déjà un livreur assigné'
      });
    }

    // Vérifier que l'utilisateur est un livreur disponible
    if (req.user.role !== 'livreur' || !req.user.livreurInfo.disponible) {
      return res.status(403).json({
        success: false,
        message: 'Vous devez être un livreur disponible'
      });
    }

    order.livreur = req.user.id;
    order.statut = 'livreur_assigne';
    await order.save();

    // Notifier le client via Socket.io
    const io = req.app.get('io');
    io.to(`order-${order._id}`).emit('livreur-assigne', {
      livreur: {
        nom: req.user.nom,
        prenom: req.user.prenom,
        telephone: req.user.telephone,
        vehicule: req.user.livreurInfo.vehicule
      }
    });

    res.status(200).json({
      success: true,
      message: 'Livreur assigné avec succès',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'assignation du livreur',
      error: error.message
    });
  }
};

// @desc    Mettre à jour le statut d'une commande
// @route   PUT /api/orders/:id/status
// @access  Private (Livreur/Admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { statut, pharmacieId, prixMedicaments } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier l'autorisation
    if (req.user.role === 'livreur' && order.livreur.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier cette commande'
      });
    }

    order.statut = statut;

    // Si pharmacie sélectionnée
    if (pharmacieId) {
      order.pharmacie = pharmacieId;
    }

    // Si prix des médicaments fourni
    if (prixMedicaments) {
      order.prix.medicaments = prixMedicaments;
      order.prix.total = prixMedicaments + order.prix.livraison;
    }

    await order.save();

    // Notifier via Socket.io
    const io = req.app.get('io');
    io.to(`order-${order._id}`).emit('statut-commande', {
      statut: order.statut,
      prix: order.prix
    });

    res.status(200).json({
      success: true,
      message: 'Statut mis à jour avec succès',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

// @desc    Annuler une commande
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res) => {
  try {
    const { raison } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    // Vérifier que la commande peut être annulée
    if (['livre', 'annulee'].includes(order.statut)) {
      return res.status(400).json({
        success: false,
        message: 'Cette commande ne peut plus être annulée'
      });
    }

    order.statut = 'annulee';
    order.annulation = {
      annuleePar: req.user.role,
      raison: raison || 'Aucune raison fournie',
      date: new Date()
    };

    await order.save();

    // Notifier via Socket.io
    const io = req.app.get('io');
    io.to(`order-${order._id}`).emit('commande-annulee', {
      raison: order.annulation.raison
    });

    res.status(200).json({
      success: true,
      message: 'Commande annulée avec succès',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'annulation de la commande',
      error: error.message
    });
  }
};








