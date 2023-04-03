/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upload')
    .setDescription('Upload to folder in Cloudinary'),
  async execute(interaction) {
    return interaction.reply('Pong!')
  },
}
