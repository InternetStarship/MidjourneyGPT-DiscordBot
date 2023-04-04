/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')

const data = new SlashCommandBuilder()
  .setName('formula-build')
  .setDescription('Build a formula with ChatGPT.')

data.addStringOption(option =>
  option
    .setName('draft')
    .setDescription(`Write your prompt draft for ChatGPT to improve.`)
    .setRequired(true)
)

module.exports = {
  data: data,
  async execute(interaction) {
    const draft = interaction.options.getString('draft')

    if (!draft) {
      return interaction.reply(`You must provide a draft.`)
    }

    interaction.reply(`Awesome, here is your possible formulas.`)
    console.log('hey')
  },
}
