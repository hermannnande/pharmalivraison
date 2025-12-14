const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  prenom: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est requis'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true // Permet les valeurs nulles uniques
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6,
    select: false // Ne pas retourner le mot de passe par défaut
  },
  role: {
    type: String,
    enum: ['client', 'livreur', 'pharmacie', 'admin'],
    default: 'client'
  },
  adresse: {
    type: String,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    address: String
  },
  photoProfile: {
    type: String,
    default: ''
  },
  actif: {
    type: Boolean,
    default: true
  },
  // Champs spécifiques pour les livreurs
  livreurInfo: {
    vehicule: {
      type: String,
      enum: ['moto', 'voiture', 'velo', 'scooter']
    },
    immatriculation: String,
    documentsVerifies: {
      type: Boolean,
      default: false
    },
    disponible: {
      type: Boolean,
      default: false
    },
    note: {
      type: Number,
      default: 5,
      min: 0,
      max: 5
    },
    nombreLivraisons: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index pour la géolocalisation
userSchema.index({ location: '2dsphere' });

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.motDePasse);
};

// Méthode pour obtenir les données publiques de l'utilisateur
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.motDePasse;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;








