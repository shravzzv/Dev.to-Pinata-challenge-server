const asyncHandler = require('express-async-handler')
const { body, validationResult, matchedData } = require('express-validator')
const User = require('../models/user')
const multerUtils = require('../utils/multer.util')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { getUploadedUrl, deleteFile } = require('../utils/pinata.util')

exports.signUp = [
  multerUtils.upload.single('file'),

  asyncHandler(async (req, res, next) => {
    if (req.file) req.uploadedUrl = await getUploadedUrl(req.file)
    next()
  }),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email must not be empty.')
    .bail()
    .isEmail()
    .withMessage('Email is not a valid email address.')
    .bail()
    .escape()
    .custom(async (email) => {
      const existingUser = await User.findOne({ email }, '_id')
      if (existingUser) throw new Error(`E-mail already in use.`)
    }),

  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be atleast 8 characters long.'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req)
    const { email, password } = matchedData(req, { onlyValidData: false })

    const newUser = new User({
      email,
      password,
      profilePicUrl: req.uploadedUrl || '',
    })

    if (errors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10)
      newUser.password = hashedPassword
      await newUser.save()

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })

      res.json({ token, userId: newUser.id })
    } else {
      res.status(401).json(errors.array())
    }
  }),
]

exports.signIn = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email must not be empty.')
    .bail()
    .isEmail()
    .withMessage('Email is not a valid email address.')
    .bail()
    .escape()
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email }, '_id password')
      if (user) req.user = user
      if (!user) throw new Error(`Email ${email} doesn't exist.`)
    }),

  body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Password must be atleast 8 characters long.')
    .bail()
    .custom(async (password, { req }) => {
      if (req.user && !(await bcrypt.compare(password, req.user.password))) {
        throw new Error('Incorrect password.')
      }
    }),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
      const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      })

      res.json({ token, userId: req.user.id })
    } else {
      res.status(401).json(errors.array())
    }
  }),
]

exports.userGet = asyncHandler(async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)
  res.json(user)
})

// *: I'm skipping user update now.
exports.userUpdate = [
  asyncHandler(async (req, res) => {
    res.send('user update not implemented')
  }),
]

exports.userDelete = asyncHandler(async (req, res) => {
  const { id } = req.params

  if (id !== req?.user?.id)
    return res.status(401).send('You can delete your own account only.')

  const user = await User.findById(id)
  const imageUrl = user.profilePicUrl

  await deleteFile(imageUrl)
  await User.findByIdAndDelete(id)

  res.send('user deleted successfully')
})
