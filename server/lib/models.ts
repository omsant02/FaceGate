import mongoose, { Schema } from 'mongoose'

// API Keys — issued to developers
const ApiKeySchema = new Schema({
  key: { type: String, required: true, unique: true },
  userId: { type: String, required: true }, // Privy user ID
  email: { type: String, required: true },
  appName: { type: String, required: true },
  action: { type: String, required: true, unique: true }, // unique World action per developer
  createdAt: { type: Date, default: Date.now },
})

// Nullifiers — enrolled faces per API key
const NullifierSchema = new Schema({
  nullifier: { type: String, required: true },
  userId: { type: String, required: true }, // developer's end-user ID
  apiKey: { type: String, required: true },
  enrolledAt: { type: Date, default: Date.now },
  lastVerifiedAt: { type: Date, default: Date.now },
})

// Unique constraint — one nullifier per userId per apiKey
NullifierSchema.index({ nullifier: 1, apiKey: 1 }, { unique: true })

export const ApiKey = mongoose.models.ApiKey || mongoose.model('ApiKey', ApiKeySchema)
export const Nullifier = mongoose.models.Nullifier || mongoose.model('Nullifier', NullifierSchema)