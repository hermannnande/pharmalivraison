/**
 * Script de données de démonstration
 * Crée des utilisateurs, pharmacies et commandes de test
 * 
 * Usage: node src/scripts/seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User.model');
const Pharmacy = require('../models/Pharmacy.model');
const Order = require('../models/Order.model');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pharmalivraison';

// Coordonnées de différentes communes d'Abidjan
const communes = {
  Cocody: { lat: 5.3599, lng: -4.0083 },
  Plateau: { lat: 5.3236, lng: -4.0083 },
  Yopougon: { lat: 5.3364, lng: -4.0819 },
  Abobo: { lat: 5.4236, lng: -4.0208 },
  Adjame: { lat: 5.3536, lng: -4.0208 },
  Marcory: { lat: 5.2936, lng: -3.9869 },
  Treichville: { lat: 5.2936, lng: -4.0083 },
  Koumassi: { lat: 5.3036, lng: -3.9536 }
};

const seedData = async () => {
  try {
    console.log('🔌 Connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');

    // Nettoyer la base de données
    console.log('🗑️  Nettoyage de la base de données...');
    await User.deleteMany({});
    await Pharmacy.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Base de données nettoyée');

    // Créer des clients
    console.log('👥 Création des clients...');
    const clients = await User.create([
      {
        nom: 'Koné',
        prenom: 'Adjoua',
        telephone: '0707070707',
        email: 'adjoua.kone@email.ci',
        motDePasse: 'test123',
        role: 'client',
        adresse: 'Cocody Riviera 2',
        location: {
          type: 'Point',
          coordinates: [communes.Cocody.lng, communes.Cocody.lat]
        }
      },
      {
        nom: 'Traoré',
        prenom: 'Ibrahim',
        telephone: '0777777777',
        motDePasse: 'test123',
        role: 'client',
        adresse: 'Yopougon Niangon',
        location: {
          type: 'Point',
          coordinates: [communes.Yopougon.lng, communes.Yopougon.lat]
        }
      },
      {
        nom: 'Bamba',
        prenom: 'Fatou',
        telephone: '0788888888',
        motDePasse: 'test123',
        role: 'client',
        adresse: 'Plateau Rue du Commerce',
        location: {
          type: 'Point',
          coordinates: [communes.Plateau.lng, communes.Plateau.lat]
        }
      }
    ]);
    console.log(`✅ ${clients.length} clients créés`);

    // Créer des livreurs
    console.log('🏍️  Création des livreurs...');
    const livreurs = await User.create([
      {
        nom: 'Kouassi',
        prenom: 'Jean',
        telephone: '0708080808',
        motDePasse: 'test123',
        role: 'livreur',
        adresse: 'Adjamé',
        location: {
          type: 'Point',
          coordinates: [communes.Adjame.lng, communes.Adjame.lat]
        },
        livreurInfo: {
          vehicule: 'moto',
          immatriculation: 'AB-1234-CI',
          documentsVerifies: true,
          disponible: true,
          note: 4.8,
          nombreLivraisons: 45
        }
      },
      {
        nom: 'Yao',
        prenom: 'Marcel',
        telephone: '0709090909',
        motDePasse: 'test123',
        role: 'livreur',
        adresse: 'Abobo',
        location: {
          type: 'Point',
          coordinates: [communes.Abobo.lng, communes.Abobo.lat]
        },
        livreurInfo: {
          vehicule: 'scooter',
          immatriculation: 'CD-5678-CI',
          documentsVerifies: true,
          disponible: true,
          note: 4.5,
          nombreLivraisons: 32
        }
      },
      {
        nom: 'Diabaté',
        prenom: 'Moussa',
        telephone: '0701010101',
        motDePasse: 'test123',
        role: 'livreur',
        adresse: 'Marcory',
        location: {
          type: 'Point',
          coordinates: [communes.Marcory.lng, communes.Marcory.lat]
        },
        livreurInfo: {
          vehicule: 'moto',
          immatriculation: 'EF-9012-CI',
          documentsVerifies: true,
          disponible: false,
          note: 5.0,
          nombreLivraisons: 78
        }
      }
    ]);
    console.log(`✅ ${livreurs.length} livreurs créés`);

    // Créer un administrateur
    console.log('👨‍💼 Création de l\'administrateur...');
    const admin = await User.create({
      nom: 'Admin',
      prenom: 'Super',
      telephone: '0700000000',
      email: 'admin@pharmalivraison.ci',
      motDePasse: 'admin123',
      role: 'admin',
      actif: true
    });
    console.log(`✅ Administrateur créé`);

    // Créer des propriétaires de pharmacies
    console.log('💊 Création des propriétaires de pharmacies...');
    const proprietaires = await User.create([
      {
        nom: 'Pharmacie',
        prenom: 'Admin',
        telephone: '0702020202',
        motDePasse: 'test123',
        role: 'pharmacie'
      },
      {
        nom: 'Pharmacie',
        prenom: 'Admin2',
        telephone: '0703030303',
        motDePasse: 'test123',
        role: 'pharmacie'
      }
    ]);
    console.log(`✅ ${proprietaires.length} propriétaires créés`);

    // Créer des pharmacies
    console.log('🏥 Création des pharmacies...');
    const pharmacies = await Pharmacy.create([
      {
        nom: 'Pharmacie du Plateau',
        proprietaire: proprietaires[0]._id,
        telephone: '0702020202',
        adresse: 'Avenue Chardy, Plateau',
        commune: 'Plateau',
        location: {
          type: 'Point',
          coordinates: [communes.Plateau.lng, communes.Plateau.lat]
        },
        horaires: {
          lundi: { ouverture: '08:00', fermeture: '20:00', ferme: false },
          mardi: { ouverture: '08:00', fermeture: '20:00', ferme: false },
          mercredi: { ouverture: '08:00', fermeture: '20:00', ferme: false },
          jeudi: { ouverture: '08:00', fermeture: '20:00', ferme: false },
          vendredi: { ouverture: '08:00', fermeture: '20:00', ferme: false },
          samedi: { ouverture: '08:00', fermeture: '18:00', ferme: false },
          dimanche: { ouverture: '00:00', fermeture: '00:00', ferme: true }
        },
        ouvert24h: false,
        deGarde: false,
        verification: {
          verifie: true,
          dateVerification: new Date()
        },
        note: 4.7,
        nombreCommandes: 234
      },
      {
        nom: 'Pharmacie de la Riviéra',
        proprietaire: proprietaires[0]._id,
        telephone: '0702020203',
        adresse: 'Cocody Riviéra 3',
        commune: 'Cocody',
        location: {
          type: 'Point',
          coordinates: [communes.Cocody.lng + 0.01, communes.Cocody.lat + 0.01]
        },
        horaires: {
          lundi: { ouverture: '07:00', fermeture: '22:00', ferme: false },
          mardi: { ouverture: '07:00', fermeture: '22:00', ferme: false },
          mercredi: { ouverture: '07:00', fermeture: '22:00', ferme: false },
          jeudi: { ouverture: '07:00', fermeture: '22:00', ferme: false },
          vendredi: { ouverture: '07:00', fermeture: '22:00', ferme: false },
          samedi: { ouverture: '07:00', fermeture: '22:00', ferme: false },
          dimanche: { ouverture: '08:00', fermeture: '20:00', ferme: false }
        },
        ouvert24h: false,
        deGarde: true,
        verification: {
          verifie: true,
          dateVerification: new Date()
        },
        note: 4.9,
        nombreCommandes: 456
      },
      {
        nom: 'Pharmacie 24h de Yopougon',
        proprietaire: proprietaires[1]._id,
        telephone: '0703030303',
        adresse: 'Yopougon Sicogi',
        commune: 'Yopougon',
        location: {
          type: 'Point',
          coordinates: [communes.Yopougon.lng, communes.Yopougon.lat]
        },
        ouvert24h: true,
        deGarde: true,
        verification: {
          verifie: true,
          dateVerification: new Date()
        },
        note: 4.8,
        nombreCommandes: 789
      },
      {
        nom: 'Pharmacie d\'Abobo',
        proprietaire: proprietaires[1]._id,
        telephone: '0703030304',
        adresse: 'Abobo Gare',
        commune: 'Abobo',
        location: {
          type: 'Point',
          coordinates: [communes.Abobo.lng, communes.Abobo.lat]
        },
        horaires: {
          lundi: { ouverture: '08:00', fermeture: '19:00', ferme: false },
          mardi: { ouverture: '08:00', fermeture: '19:00', ferme: false },
          mercredi: { ouverture: '08:00', fermeture: '19:00', ferme: false },
          jeudi: { ouverture: '08:00', fermeture: '19:00', ferme: false },
          vendredi: { ouverture: '08:00', fermeture: '19:00', ferme: false },
          samedi: { ouverture: '08:00', fermeture: '18:00', ferme: false },
          dimanche: { ouverture: '00:00', fermeture: '00:00', ferme: true }
        },
        ouvert24h: false,
        deGarde: false,
        verification: {
          verifie: true,
          dateVerification: new Date()
        },
        note: 4.5,
        nombreCommandes: 321
      },
      {
        nom: 'Pharmacie de Marcory',
        proprietaire: proprietaires[1]._id,
        telephone: '0703030305',
        adresse: 'Marcory Zone 4',
        commune: 'Marcory',
        location: {
          type: 'Point',
          coordinates: [communes.Marcory.lng, communes.Marcory.lat]
        },
        horaires: {
          lundi: { ouverture: '08:00', fermeture: '20:00', ferme: false },
          mardi: { ouverture: '08:00', fermeture: '20:00', ferme: false },
          mercredi: { ouverture: '08:00', fermeture: '20:00', ferme: false },
          jeudi: { ouverture: '08:00', fermeture: '20:00', ferme: false },
          vendredi: { ouverture: '08:00', fermeture: '20:00', ferme: false },
          samedi: { ouverture: '08:00', fermeture: '20:00', ferme: false },
          dimanche: { ouverture: '09:00', fermeture: '18:00', ferme: false }
        },
        ouvert24h: false,
        deGarde: false,
        verification: {
          verifie: true,
          dateVerification: new Date()
        },
        note: 4.6,
        nombreCommandes: 198
      }
    ]);
    console.log(`✅ ${pharmacies.length} pharmacies créées`);

    // Créer des commandes de démonstration
    console.log('📦 Création des commandes...');
    const orders = await Order.create([
      {
        numeroCommande: 'PL20241210001',
        client: clients[0]._id,
        livreur: livreurs[0]._id,
        pharmacie: pharmacies[1]._id,
        description: 'Doliprane 1000mg x2 boîtes, Amoxicilline 500mg x1 boîte',
        adresseLivraison: {
          adresse: 'Cocody Riviera 2, Immeuble les Harmonies',
          location: {
            type: 'Point',
            coordinates: [communes.Cocody.lng, communes.Cocody.lat]
          },
          instructions: '2ème étage, porte 204'
        },
        statut: 'en_route_client',
        prix: {
          medicaments: 8500,
          livraison: 1000,
          total: 9500
        },
        paiement: {
          statut: 'en_attente',
          methode: 'especes'
        }
      },
      {
        numeroCommande: 'PL20241210002',
        client: clients[1]._id,
        description: 'Paracétamol, Ibuprofène',
        adresseLivraison: {
          adresse: 'Yopougon Niangon, près de la station Total',
          location: {
            type: 'Point',
            coordinates: [communes.Yopougon.lng, communes.Yopougon.lat]
          }
        },
        statut: 'en_attente',
        prix: {
          medicaments: 0,
          livraison: 1000,
          total: 0
        }
      },
      {
        numeroCommande: 'PL20241210003',
        client: clients[2]._id,
        livreur: livreurs[2]._id,
        pharmacie: pharmacies[0]._id,
        description: 'Efferalgan, Sirop pour la toux',
        adresseLivraison: {
          adresse: 'Plateau, Rue du Commerce',
          location: {
            type: 'Point',
            coordinates: [communes.Plateau.lng, communes.Plateau.lat]
          }
        },
        statut: 'livre',
        prix: {
          medicaments: 12000,
          livraison: 1000,
          total: 13000
        },
        paiement: {
          statut: 'paye',
          methode: 'especes',
          datePaiement: new Date()
        }
      }
    ]);
    console.log(`✅ ${orders.length} commandes créées`);

    console.log('\n🎉 Données de démonstration créées avec succès!\n');
    console.log('📋 Résumé:');
    console.log(`   - ${clients.length} clients`);
    console.log(`   - ${livreurs.length} livreurs`);
    console.log(`   - ${pharmacies.length} pharmacies`);
    console.log(`   - ${orders.length} commandes\n`);

    console.log('👤 Comptes de test:');
    console.log('\n📱 CLIENT:');
    console.log('   Téléphone: 0707070707');
    console.log('   Mot de passe: test123');
    
    console.log('\n🏍️  LIVREUR:');
    console.log('   Téléphone: 0708080808');
    console.log('   Mot de passe: test123');

    console.log('\n💊 PHARMACIE:');
    console.log('   Téléphone: 0702020202');
    console.log('   Mot de passe: test123');

    console.log('\n👨‍💼 ADMIN:');
    console.log('   Téléphone: 0700000000');
    console.log('   Mot de passe: admin123\n');

    await mongoose.connection.close();
    console.log('✅ Déconnecté de MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
};

seedData();

