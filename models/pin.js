const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PinSchema = new Schema({
  url: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  tags: { type: [String] },
})

module.exports = new mongoose.model('Pin', PinSchema)
