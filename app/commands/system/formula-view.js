/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')
const { formulas } = require('../../config/database.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('formula-view')
    .setDescription("View any formula and it's attributes. (case sensitive)")
    .addStringOption(option =>
      option
        .setName('name')
        .setDescription(`Name of the formula you want to view.`)
        .setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString('name')
    const formula = formulas[`${name}`]

    if (!name) {
      return interaction.reply(`You must provide a name for your formula.`)
    }

    if (!formula) {
      return interaction.reply(`That formula does not exist.`)
    } else {
      return interaction.reply(`/formula-view\n
**Prompt Formula:**
\> ${formula}

**Attributes:**
${extractPhrases(formula)}
`)
    }
  },
}

function extractPhrases(inputString) {
  const regex = /\[([^\]]+)\]/g
  let phrases = ''

  let match
  while ((match = regex.exec(inputString)) !== null) {
    phrases += `\> -> ` + match[1] + '\n'
  }

  return phrases
}
