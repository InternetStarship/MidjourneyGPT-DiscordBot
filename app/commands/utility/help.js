/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')
const { formulas } = require('../../engine/midjourney-formulas.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Learn how this bot works.'),
  async execute(interaction) {
    return interaction.reply(`/help\n
**MidjourneyGPT**
\> This bot is designed to connect to **ChatGPT** and generate prompts for **Midjourney** then upload the results to **Cloudinary**.
\> 
\> ** Advanced Editing **
\> Any attribute can be edited in the **advanced** input in the **/auto-imagine** command. You can use the following format to edit any dynamic attribute in the formula like this \`[time of day=night]\` or \`[perspective=far]\` and you can combine them like this \`[time of day=night] [perspective=far]\` or \`[time of day=night] [perspective=far] [weather=rain]\` and so on depending what is in the formula.
\> 
\> ** Add Formulas **
\> You can add new formulas by editing the \`midjourney-formulas.json\` file as an administrator and then restarting the bot server or ask wynter@hey.com for help with your own private MidjourneyGPT bot.

**Loaded Formulas**
${generateSimplifiedOutput()}`)
  },
}

function generateSimplifiedOutput(json) {
  let output = ''

  for (const key in formulas) {
    output += `\>  →  **${key}**\n`
  }

  return output
}
