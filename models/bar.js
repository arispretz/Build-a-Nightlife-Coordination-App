const mongoose = require('mongoose');

const barSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  foursquareId: { type: String, required: true }
});

module.exports = mongoose.model('Bar', barSchema);
