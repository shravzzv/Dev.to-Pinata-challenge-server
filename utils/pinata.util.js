const asyncHandler = require('express-async-handler')
const pinata = require('../config/pinata.config')
const { Blob } = require('buffer')
const fs = require('fs')

exports.getUploadedUrl = asyncHandler(async (fileToUpload) => {
  const blob = new Blob([fs.readFileSync(fileToUpload.path)])

  const file = new File([blob], fileToUpload.filename, {
    type: fileToUpload.mimetype,
  })

  const upload = await pinata.upload.file(file)
  console.log(upload)

  fs.unlink(fileToUpload.path, (err) => err && console.log(err))
})
