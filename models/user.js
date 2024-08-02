const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bar' }]
});

module.exports = mongoose.model('User', userSchema);
