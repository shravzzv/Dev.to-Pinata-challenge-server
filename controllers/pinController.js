const asyncHandler = require('express-async-handler')

exports.pinsGet = asyncHandler(async (req, res) => {
  res.send('files get not implemented')
})

exports.pinGet = asyncHandler(async (req, res) => {
  res.send('file get not implemented')
})

exports.pinPost = asyncHandler(async (req, res) => {
  res.send('file post not implemented')
})

exports.pinUpdate = asyncHandler(async (req, res) => {
  res.send('file update not implemented')
})

exports.pinDelete = asyncHandler(async (req, res) => {
  res.send('file delete not implemented')
})
