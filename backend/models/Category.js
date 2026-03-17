const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  icon: { type: String, default: 'other' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
module.exports = mongoose.model('Category', CategorySchema);
