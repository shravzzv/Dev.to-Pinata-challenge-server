const asyncHandler = require('express-async-handler')
const pinata = require('../config/pinata.config')
const { Blob } = require('buffer')
const fs = require('fs')

/**
 * Uploads a given image to Pinata and returns the uploaded url. The image is optimized using Pinata.
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
      format: 'webp',
      fit: 'cover',
      gravity: 'auto',
      format: 'webp',
      sharpen: 5,
    })

  return url
})
// !problem: Prevent deletion of shared files. Pinata automatically recognizes duplicate files and prevents duplicates.

/**
 * Deleted a file from Pinata.
 * @param {String} - The URL of the uploaded file.
 */
exports.deleteFile = asyncHandler(async (url) => {
  const cid = url.split('/')[4].split('?')[0]

  const files = await pinata.files.list().cid(cid)

  const id = files.files[0].id

  await pinata.files.delete([id])
})
