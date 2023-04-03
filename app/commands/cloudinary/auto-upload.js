/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('auto-upload')
    .setDescription(
      'Toggle "Auto-Upload" - Automatically upload images to Cloudinary with ChatGPT suggested folders based on prompt.'
    ),
  async execute(interaction) {
    return interaction.reply('Pong!')
  },
}
