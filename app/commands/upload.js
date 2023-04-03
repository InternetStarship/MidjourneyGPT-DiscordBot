/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const cloudinary = require('cloudinary')

function upload(message) {
  const file =
    'https://media.discordapp.net/ephemeral-attachments/1071927262099804202/1092269361789673492/wynterjones_A_photograph_of_a_Maine_Coon_cat_climbing_a_tree_wi_094ad523-1b60-4a31-a4a0-ca45624dd6c1.png?width=2324&height=1302'
  const innerFolder = 'photos'
  const folder = `${process.env.CLOUDINARY_FOLDER}/${innerFolder}`

  cloudinary.v2.uploader
    .unsigned_upload(file, process.env.CLOUDINARY_UPLOAD_PRESET, {
      folder: folder,
    })
    .then(response => {
      message.channel.send(
        `Uploaded to Cloudinary -> **/${folder}**\n ${response.secure_url}`
      )
    })
}

module.exports = upload
