// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // rename to `phone` to match frontend
  phone: { type: String, required: true },
  password: { type: String, required: true },
  preferredLanguage: {
    type: String,
    enum: ['en', 'hi', 'es', 'fr', 'zh', 'ko', 'ru', 'pa'], // adjust allowed languages to your SupportedLanguage
    default: 'en',
  },
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password; // never expose password
    }
  },
  toObject: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.password;
    }
  }
});

module.exports = mongoose.model('User', userSchema);
