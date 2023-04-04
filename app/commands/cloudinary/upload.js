/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')
const cloudinary = require('cloudinary')

const data = new SlashCommandBuilder()
  .setName('upload-file')
  .setDescription('Upload a file to Cloudinary folder.')

data.addStringOption(option =>
  option
    .setName('file')
    .setDescription('What is the file URL?')
    .setRequired(true)
)

data.addStringOption(option =>
  option
    .setName('folder')
    .setDescription(
      'What folder should the file be uploaded to? (can include subfolder, ex. photos/dark)'
    )
    .setRequired(true)
)

module.exports = {
  data: data,
  async execute(interaction) {
    const file = interaction.options.getString('file')
    const folder = interaction.options.getString('folder')

    if (!file) return interaction.reply('Please provide a file.')
    if (!folder) return interaction.reply('Please provide a folder.')

    await interaction.deferReply()
    await interaction.editReply(await upload(file, folder))
  },
}

async function upload(file, folder = '') {
  const path = `${process.env.CLOUDINARY_FOLDER}/${folder}`

  return await cloudinary.v2.uploader
    .unsigned_upload(file, process.env.CLOUDINARY_UPLOAD_PRESET, {
      folder: path,
    })
    .then(response => {
      return `🤖\n**Successfully Uploaded** \`\`\`${response.secure_url}\`\`\` `
    })
    .catch(error => {
      return `🪳\n**Error Uploading** \`\`\`${error}\`\`\` `
    })
}
