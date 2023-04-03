/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs').promises

const data = new SlashCommandBuilder()
  .setName('auto-upload')
  .setDescription(
    'Toggle "Auto-Upload" - Automatically upload images to Cloudinary with ChatGPT suggested folders.'
  )

data.addStringOption(option =>
  option
    .setName('isenabled')
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
    const filePath = './app/database/auto-upload.json'
    const isenabled = interaction.options.getString('isenabled')

    try {
      const data = await fs.readFile(filePath, 'utf8')
      const config = JSON.parse(data)
      config.enabled = isenabled === 'true' ? true : false

      await fs.writeFile(filePath, JSON.stringify(config, null, 2))
      const response = config.enabled
        ? 'Auto-upload enabled.'
        : 'Auto-upload disabled.'
      return interaction.reply(response)
    } catch (err) {
      console.error(`Error: ${err}`)
      const response = 'An error occurred while toggling auto-upload.'
      return interaction.reply(response)
    }
  },
}
