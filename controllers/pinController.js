const asyncHandler = require('express-async-handler')
const { body, validationResult, matchedData } = require('express-validator')
const Pin = require('../models/pin')
const User = require('../models/user')
const multerUtils = require('../utils/multer.util')
const { getUploadedUrl } = require('../utils/pinata.util')

exports.pinsGet = asyncHandler(async (req, res) => {
  const { user } = req.query

  const filter = {}
  if (user) filter.user = user

  const pins = await Pin.find(filter)
    .populate('user')
    .sort({ createdAt: -1, updatedAt: -1 })

  res.json(pins)
})

exports.pinGet = asyncHandler(async (req, res) => {
  const { id } = req.params
  const pin = await Pin.findById(id).populate('user')
  res.json(pin)
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

exports.pinUpdate = [
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

    const currentPin = await Pin.findById(req.params.id).populate('user')

    if (!currentPin) return res.status(400).send('Pin not found')

    if (currentPin.user.id !== req.user.id)
      return res.status(401).send('You can update your own pins only')

    const updatedPin = new Pin({
      ...currentPin._doc,
      title,
      description,
      tags,
    })

    if (errors.isEmpty()) {
      await Pin.findByIdAndUpdate(req.params.id, updatedPin)

      res.send('Pin updated successfully')
    } else {
      res.status(401).json(errors.array())
    }
  }),
]

exports.pinDelete = asyncHandler(async (req, res) => {
  const { id } = req.params
  const pin = await Pin.findById(id).populate('user')

  if (!pin) return res.status(400).send('Pin not found')

  if (pin.user.id !== req.user.id)
    return res.status(401).send('You can delete your own pins only')

  // await deleteFile(pin.url)
  // *: I'm preventing deletion from the Pinata because it doesn't store duplicates. Multiple posts might share the same image url.

  await Pin.findByIdAndDelete(id)

  res.send('pin deleted successfully')
})

exports.search = [
  body('searchQuery')
    .trim()
    .escape()
    .isLength({ min: 1, max: 32 })
    .withMessage(
      'Search query cannot be empty. It should be 1-32 characters long.'
    ),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    const sanitizedData = matchedData(req)

    if (errors.isEmpty()) {
      const messages = await Pin.aggregate().search({
        index: process.env.MONGO_ATLAS_SEARCH_INDEX,
        text: {
          query: sanitizedData.searchQuery,
          path: {
            wildcard: '*',
          },
        },
      })

      res.json(messages)
    } else {
      res.json(errors.array())
    }
  }),
]

exports.pinSave = asyncHandler(async (req, res) => {
  const { id } = req.params

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { savedPins: id } },
    { new: true }
  )

  res.json(updatedUser)
})

exports.pinUnSave = asyncHandler(async (req, res) => {
  const { id } = req.params

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { savedPins: id } },
    { new: true }
  )

  res.json(updatedUser)
})
