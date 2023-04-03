/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('formula-add')
    .setDescription('Add a new formula to the database.'),
  async execute(interaction) {
    return interaction.reply('Pong!')
  },
}
