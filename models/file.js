const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FileSchema = new Schema({
  url: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
})

module.exports = new mongoose.model('File', FileSchema)
