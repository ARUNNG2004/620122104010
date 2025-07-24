import mongoose from 'mongoose';

const shortUrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },

  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date, required: true },
  
  clicks: { type: Number, default: 0 }
});

export default mongoose.model('ShortUrl', shortUrlSchema);
