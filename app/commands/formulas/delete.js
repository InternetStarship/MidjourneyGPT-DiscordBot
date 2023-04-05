/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs')

const data = new SlashCommandBuilder()
  .setName('formula-delete')
  .setDescription('Delete formula from your database.')

data.addStringOption(option =>
  option
    .setName('name')
    .setDescription(`Name of prompt formula to delete.`)
    .setRequired(true)
)

module.exports = {
  data: data,
  async execute(interaction) {
    const name = interaction.options.getString('name')

    if (!name) {
      return interaction.reply(`You must provide a name for your formula.`)
    }

    const filePath = './app/config/database.json'

    try {
      const fileData = await fs.readFileSync(filePath, 'utf8')
      const data = JSON.parse(fileData)

      if (!data.formulas[name]) {
        return interaction.reply(
          `Formula with name ${name} does not exist in database.`
        )
      } else {
        delete data.formulas[name]
      }

      await fs.writeFile(filePath, JSON.stringify(data, null, 2), () => {
        console.log('Updated database.json file.')
      })

      return interaction.reply(
        `🛑\n\n**Deleted formula from database.**
        \> You must restart your bot server to populate in slash commands.`
      )
    } catch (err) {
      const response = 'An error occurred while toggling auto-upload: ' + err
      console.log(err)
      return interaction.reply(response)
    }
  },
}
