const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicUrl: { type: String, default: '' },
  savedPins: [{ type: Schema.Types.ObjectId, ref: 'Pin' }],
})

module.exports = new mongoose.model('User', UserSchema)
