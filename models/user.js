const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
})

module.exports = new mongoose.model('User', UserSchema)
