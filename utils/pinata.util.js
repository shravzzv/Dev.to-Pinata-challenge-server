const asyncHandler = require('express-async-handler')
const pinata = require('../config/pinata.config')
const { Blob } = require('buffer')
const fs = require('fs')

/**
 * Uploads a given image to Pinata and returns the uploaded url. The image is optimized
 */
exports.getUploadedUrl = asyncHandler(async (fileToUpload) => {
  const blob = new Blob([fs.readFileSync(fileToUpload.path)])

  const file = new File([blob], fileToUpload.filename, {
    type: fileToUpload.mimetype,
  })

  const upload = await pinata.upload.file(file)

  fs.unlink(fileToUpload.path, (err) => err && console.log(err))

  const url = await pinata.gateways
    .createSignedURL({
      cid: upload.cid,
      expires: 5000000,
    })
    .optimizeImage({
      width: 500,
      height: 500,
      format: 'webp',
      fit: 'cover',
      gravity: 'auto',
      format: 'webp',
      sharpen: 5,
    })

  return url
})
