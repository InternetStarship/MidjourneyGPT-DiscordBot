/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs')

const data = new SlashCommandBuilder()
  .setName('formula-add')
  .setDescription('Add a formula to your database.')

data.addStringOption(option =>
  option
    .setName('name')
    .setDescription(
      `Give your Midjourney prompt formula a name. (will overwrite any formula with the same name)`
    )
    .setRequired(true)
)

data.addStringOption(option =>
  option
    .setName('prompt')
    .setDescription(
      `Write the prompt for your formula. Use [keyword=value] to add variables.`
    )
    .setRequired(true)
)

module.exports = {
  data: data,
  async execute(interaction) {
    const name = interaction.options.getString('name')
    const prompt = interaction.options.getString('prompt')

    if (!name) {
      return interaction.reply(`You must provide a name for your formula.`)
    }

    if (!prompt) {
      return interaction.reply(`You must provide a prompt for your formula.`)
    }

    const filePath = './app/config/database.json'

    try {
      const fileData = await fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(fileData)

      data.formulas[`${name}`] = prompt

      await fs.writeFile(filePath, JSON.stringify(data, null, 2), () => {
        console.log('Updated database.json file.')
        console.log('Old data:', fileData)
        console.log('New data:', JSON.stringify(data, null, 2))
      })

      return interaction.reply(`✅\n\n**Added formula to database.**`)
    } catch (err) {
      const response = 'An error occurred while toggling auto-upload: ' + err
      console.log(err)
      return interaction.reply(response)
    }
  },
}
