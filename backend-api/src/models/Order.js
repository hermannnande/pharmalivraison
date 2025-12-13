const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  livreur: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  medications: [{
    name: String,
    quantity: Number,
    price: Number
  }],
  prescriptionImage: { type: String },
  symptoms: { type: String },
  totalPrice: { type: Number, required: true },
  deliveryFee: { type: Number, default: 1000 },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'preparing', 'assigned', 'picking', 'delivering', 'delivered', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: { type: String },
  deliveryLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  estimatedTime: { type: Number },
  recipientName: { type: String },
  recipientPhone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);


