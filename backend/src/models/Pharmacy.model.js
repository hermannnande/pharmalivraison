const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom de la pharmacie est requis'],
    trim: true
  },
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    trim: true
  },
  adresse: {
    type: String,
    required: [true, 'L\'adresse est requise'],
    trim: true
  },
  commune: {
    type: String,
    required: [true, 'La commune est requise'],
    enum: [
      'Abobo', 'Adjamé', 'Attécoubé', 'Cocody', 'Koumassi',
      'Marcory', 'Plateau', 'Port-Bouët', 'Treichville', 'Yopougon',
      'Bingerville', 'Songon', 'Anyama'
    ]
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Les coordonnées sont requises']
    }
  },
  horaires: {
    lundi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
    mardi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
    mercredi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
    jeudi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
    vendredi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
    samedi: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } },
    dimanche: { ouverture: String, fermeture: String, ferme: { type: Boolean, default: false } }
  },
  ouvert24h: {
    type: Boolean,
    default: false
  },
  deGarde: {
    type: Boolean,
    default: false
  },
  photo: {
    type: String,
    default: ''
  },
  licence: {
    numero: String,
    dateExpiration: Date
  },
  verification: {
    verifie: {
      type: Boolean,
      default: false
    },
    dateVerification: Date
  },
  note: {
    type: Number,
    default: 5,
    min: 0,
    max: 5
  },
  nombreCommandes: {
    type: Number,
    default: 0
  },
  actif: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour la géolocalisation
pharmacySchema.index({ location: '2dsphere' });

// Méthode pour vérifier si la pharmacie est ouverte maintenant
pharmacySchema.methods.estOuverte = function() {
  if (this.ouvert24h) return true;
  if (this.deGarde) return true;

  const maintenant = new Date();
  const jour = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][maintenant.getDay()];
  const horaireJour = this.horaires[jour];

  if (!horaireJour || horaireJour.ferme) return false;

  // Vérifier les heures (à améliorer avec une vraie comparaison d'heures)
  return true;
};

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);

module.exports = Pharmacy;








