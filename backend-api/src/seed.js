require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/Order');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connecté');

    // Nettoyer la base
    await User.deleteMany({});
    await Order.deleteMany({});
    console.log('🧹 Base nettoyée');

    // Créer utilisateurs
    const users = await User.create([
      {
        firstName: 'Jean',
        lastName: 'Kouassi',
        email: 'client@test.com',
        phone: '+225 07 12 34 56 78',
        password: 'test123',
        role: 'client',
        address: 'Cocody, Abidjan',
        location: { coordinates: [-4.0083, 5.3600] }
      },
      {
        firstName: 'Mohamed',
        lastName: 'Diallo',
        email: 'livreur@test.com',
        phone: '+225 07 98 76 54 32',
        password: 'test123',
        role: 'livreur',
        isAvailable: true,
        rating: 4.9,
        totalDeliveries: 342
      },
      {
        firstName: 'Dr. Koffi',
        lastName: 'Yao',
        email: 'pharmacien@test.com',
        phone: '+225 27 22 45 67 89',
        password: 'test123',
        role: 'pharmacien'
      }
    ]);

    console.log('✅ Utilisateurs créés:', users.length);

    // Créer commandes
    const orders = await Order.create([
      {
        orderNumber: 'CMD001',
        client: users[0]._id,
        livreur: users[1]._id,
        medications: [
          { name: 'Doliprane 1000mg', quantity: 2, price: 2500 },
          { name: 'Amoxicilline 500mg', quantity: 1, price: 4500 }
        ],
        totalPrice: 9500,
        status: 'delivering',
        deliveryAddress: 'Cocody Angré',
        deliveryLocation: { coordinates: [-4.0100, 5.3650] }
      },
      {
        orderNumber: 'CMD002',
        client: users[0]._id,
        medications: [
          { name: 'Vitamine C', quantity: 1, price: 3500 }
        ],
        totalPrice: 3500,
        status: 'pending',
        deliveryAddress: 'Cocody Angré',
        deliveryLocation: { coordinates: [-4.0100, 5.3650] }
      }
    ]);

    console.log('✅ Commandes créées:', orders.length);
    console.log('');
    console.log('========================================');
    console.log('BASE DE DONNÉES PEUPLÉE !');
    console.log('========================================');
    console.log('');
    console.log('COMPTES DE TEST:');
    console.log('');
    console.log('CLIENT:');
    console.log('  Email: client@test.com');
    console.log('  Password: test123');
    console.log('');
    console.log('LIVREUR:');
    console.log('  Email: livreur@test.com');
    console.log('  Password: test123');
    console.log('');
    console.log('PHARMACIEN:');
    console.log('  Email: pharmacien@test.com');
    console.log('  Password: test123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
};

seedDatabase();





