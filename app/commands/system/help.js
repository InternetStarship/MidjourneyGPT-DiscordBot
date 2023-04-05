/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')
const { formulas } = require('../../config/database.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('formula-help')
    .setDescription('Learn how this bot works.'),
  async execute(interaction) {
    const data = generateSimplifiedOutput()
    const formulas = data.output
    const count = data.count

    return interaction.reply(`/help\n
\> This bot is designed to connect to **ChatGPT** and generate prompts for **Midjourney** then auto-upload the upscaled images to a **Cloudinary** folder that is self organized by **ChatGPT**.

\> **Advanced Editing**
\> Any attribute can be edited in the **advanced** input in the **/prompt-formula** command. You can use the following format to edit any dynamic attribute in the formula like this \`[time of day=night]\` or \`[perspective=far]\` and so on depending what is in the formula. 

\> **Add & Delete Formulas**
\> You can add and delete formulas in the **/formula-add** command. You can view the formula by using the **/formula-view** command to get an explanation of what each formula and it's attributes.

**Loaded Formulas (${count})**
${formulas}`)
  },
}

function generateSimplifiedOutput(json) {
  let output = ''
  let count = 0

  for (const key in formulas) {
    count++
    output += `\>  →  **${key}**\n`
  }

  return { output, count }
}
