const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  livreur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['assigned', 'picking', 'delivering', 'delivered'],
    default: 'assigned'
  },
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  route: [{ lat: Number, lng: Number }],
  estimatedTime: { type: Number },
  distance: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);





