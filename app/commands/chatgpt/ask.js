/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Auto imagine with ChatGPT'),
  async execute(interaction) {
    return interaction.reply('Pong!')
  },
}
