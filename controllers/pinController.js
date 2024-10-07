const asyncHandler = require('express-async-handler')
const { body, validationResult, matchedData } = require('express-validator')
const Pin = require('../models/pin')
const multerUtils = require('../utils/multer.util')
const { getUploadedUrl, deleteFile } = require('../utils/pinata.util')

exports.pinsGet = asyncHandler(async (req, res) => {
  res.send('files get not implemented')
})

exports.pinGet = asyncHandler(async (req, res) => {
  res.send('file get not implemented')
})

exports.pinPost = [
  multerUtils.upload.single('file'),

  asyncHandler(async (req, res, next) => {
    if (req.file) req.uploadedUrl = await getUploadedUrl(req.file)
    next()
  }),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title must not be empty.')
    .bail()
    .isLength({ min: 3, max: 32 })
    .withMessage('Title must be 3-32 characters long.')
    .escape(),

  body('description').trim().escape().optional(),

  body('tags')
    .trim()
    .escape()
    .optional()
    .customSanitizer((value) =>
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    ),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    const { title, description, tags } = matchedData(req, {
      onlyValidData: false,
      includeOptionals: true,
    })

    const newPin = new Pin({
      title,
      description,
      tags,
      user: req.user.id,
      url: req.uploadedUrl || '',
    })

    if (errors.isEmpty()) {
      await newPin.save()
      res.send('Pin created successfully')
    } else {
      res.status(401).json(errors.array())
    }
  }),
]

exports.pinUpdate = asyncHandler(async (req, res) => {
  res.send('file update not implemented')
})

exports.pinDelete = asyncHandler(async (req, res) => {
  res.send('file delete not implemented')
})
