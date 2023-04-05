/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')
const fs = require('node:fs')

const data = new SlashCommandBuilder()
  .setName('upload-auto-toggle-cloudinary')
  .setDescription(
    'Automatically upload images to Cloudinary with ChatGPT suggested folders.'
  )

data.addStringOption(option =>
  option
    .setName('toggle')
    .setDescription(`Pick a formula to use.`)
    .addChoices(
      { name: 'Enabled', value: 'true' },
      { name: 'Disabled', value: 'false' }
    )
    .setRequired(true)
)

module.exports = {
  data: data,
  async execute(interaction) {
    const filePath = './app/config/database.json'
    const toggle = interaction.options.getString('toggle')

    try {
      const fileData = await fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(fileData)

      data.config.auto_upload = toggle && toggle === 'true' ? true : false

      await fs.writeFile(filePath, JSON.stringify(data, null, 2), () => {
        console.log('Updated database.json file.')
      })

      const response = data.config.auto_upload
        ? '✅ Auto-upload enabled.'
        : '❌ Auto-upload disabled.'

      return interaction.reply(response)
    } catch (err) {
      const response =
        '🪳\nAn error occurred while toggling auto-upload: ' + err
      return interaction.reply(response)
    }
  },
}
