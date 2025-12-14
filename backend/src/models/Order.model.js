const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  livreur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  pharmacie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    default: null
  },
  numeroCommande: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: [true, 'La description des médicaments est requise'],
    trim: true
  },
  ordonnance: {
    url: String,
    cloudinaryId: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  adresseLivraison: {
    adresse: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    instructions: String // Instructions spéciales pour le livreur
  },
  statut: {
    type: String,
    enum: [
      'en_attente',        // Commande créée, en attente d'un livreur
      'livreur_assigne',   // Livreur trouvé et assigné
      'en_route_pharmacie',// Livreur en route vers la pharmacie
      'a_la_pharmacie',    // Livreur à la pharmacie
      'achat_en_cours',    // Achat des médicaments en cours
      'en_route_client',   // Livreur en route vers le client
      'livre',             // Livraison effectuée
      'annulee'            // Commande annulée
    ],
    default: 'en_attente'
  },
  prix: {
    medicaments: {
      type: Number,
      default: 0
    },
    livraison: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      default: 0
    }
  },
  paiement: {
    statut: {
      type: String,
      enum: ['en_attente', 'paye', 'rembourse'],
      default: 'en_attente'
    },
    methode: {
      type: String,
      enum: ['especes', 'mobile_money', 'carte'],
      default: 'especes'
    },
    datePaiement: Date
  },
  historique: [{
    statut: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  estimations: {
    tempsArriveePharmacieMinutes: Number,
    tempsArriveeClientMinutes: Number,
    distancePharmacieKm: Number,
    distanceClientKm: Number
  },
  evaluation: {
    noteClient: {
      type: Number,
      min: 0,
      max: 5
    },
    commentaireClient: String,
    noteLivreur: {
      type: Number,
      min: 0,
      max: 5
    },
    commentaireLivreur: String
  },
  annulation: {
    annuleePar: {
      type: String,
      enum: ['client', 'livreur', 'admin']
    },
    raison: String,
    date: Date
  }
}, {
  timestamps: true
});

// Index pour recherche rapide
orderSchema.index({ client: 1, createdAt: -1 });
orderSchema.index({ livreur: 1, statut: 1 });
orderSchema.index({ statut: 1 });
orderSchema.index({ numeroCommande: 1 });

// Générer un numéro de commande unique
orderSchema.pre('save', async function(next) {
  if (!this.numeroCommande) {
    const date = new Date();
    const random = Math.floor(Math.random() * 10000);
    this.numeroCommande = `PL${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(random).padStart(4, '0')}`;
  }
  next();
});

// Ajouter l'entrée dans l'historique lors du changement de statut
orderSchema.pre('save', function(next) {
  if (this.isModified('statut')) {
    this.historique.push({
      statut: this.statut,
      date: new Date(),
      note: `Statut changé en ${this.statut}`
    });
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;








