const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Inscription d'un utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { nom, prenom, telephone, email, motDePasse, role, adresse } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ telephone });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec ce numéro de téléphone existe déjà'
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      nom,
      prenom,
      telephone,
      email,
      motDePasse,
      role: role || 'client',
      adresse
    });

    // Générer le token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: {
        user: {
          id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          telephone: user.telephone,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    });
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { telephone, motDePasse } = req.body;

    // Vérifier si les champs sont remplis
    if (!telephone || !motDePasse) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un téléphone et un mot de passe'
      });
    }

    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findOne({ telephone }).select('+motDePasse');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(motDePasse);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides'
      });
    }

    // Vérifier si le compte est actif
    if (!user.actif) {
      return res.status(403).json({
        success: false,
        message: 'Votre compte a été désactivé'
      });
    }

    // Générer le token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user._id,
          nom: user.nom,
          prenom: user.prenom,
          telephone: user.telephone,
          email: user.email,
          role: user.role,
          photoProfile: user.photoProfile
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion',
      error: error.message
    });
  }
};

// @desc    Obtenir l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};








