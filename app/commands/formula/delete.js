/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('formula-delete')
    .setDescription('Delete a formula from the database.'),
  async execute(interaction) {
    return interaction.reply('Pong!')
  },
}
