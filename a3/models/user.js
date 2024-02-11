const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  userId: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: null }, // Updated field
  deletionDate: { type: Date, default: null }, // Soft deletion field
  isAdmin: { type: Boolean, default: false },
});

userSchema.pre('save', function (next) {
  this.updateDate = new Date();
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
