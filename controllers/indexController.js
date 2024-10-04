const asyncHandler = require('express-async-handler')

exports.fileGet = asyncHandler(async (req, res) => {
  res.send('file post not implemented')
})

exports.filePost = asyncHandler(async (req, res) => {
  res.send('file post not implemented')
})

exports.fileUpdate = asyncHandler(async (req, res) => {
  res.send('file update not implemented')
})

exports.fileDelete = asyncHandler(async (req, res) => {
  res.send('file delete not implemented')
})
