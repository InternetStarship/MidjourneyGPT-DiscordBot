/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Learn how this bot works.'),
  async execute(interaction) {
    return interaction.reply(`Help\n
    This bot is a work in progress. It is currently in the early stages of development. It is not yet ready for use.\n\n`)
  },
}
