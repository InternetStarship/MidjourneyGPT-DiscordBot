/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs').promises

const data = new SlashCommandBuilder()
  .setName('delete-formula')
  .setDescription('Delete formula to your bot database.')

data.addStringOption(option =>
  option
    .setName('name')
    .setDescription(`Give your Midjourney prompt formula a name.`)
    .setRequired(true)
)

module.exports = {
  data: data,
  async execute(interaction) {
    // const filePath = './app/database.json'
    // const name = interaction.options.getString('name')
    // try {
    //   const fileData = await fs.readFileSync(filePath, 'utf8')
    //   const data = JSON.parse(fileData)
    //   data.config.enabled = toggle === 'true' ? true : false
    //   await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    //   const response = data.config.enabled
    //     ? 'Auto-upload enabled.'
    //     : 'Auto-upload disabled.'
    //   return interaction.reply(response)
    // } catch (err) {
    //   const response = 'An error occurred while toggling auto-upload: ' + err
    //   return interaction.reply(response)
    // }
  },
}
