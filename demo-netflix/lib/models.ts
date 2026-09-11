import mongoose, { Schema } from 'mongoose'

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const User = mongoose.models.User || mongoose.model('User', UserSchema)