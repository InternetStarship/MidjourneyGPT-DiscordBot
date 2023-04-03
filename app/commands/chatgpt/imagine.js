/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const { SlashCommandBuilder } = require('discord.js')
const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
})
const openai = new OpenAIApi(configuration)
const { formulas } = require('../../database.json')
const options = Object.entries(formulas).map(([key, value]) => {
  return {
    name: key,
    value: key,
  }
})

const data = new SlashCommandBuilder()
  .setName('auto-imagine')
  .setDescription('Auto imagine with ChatGPT')

data.addStringOption(option =>
  option
    .setName('formula')
    .setDescription(`Pick a formula to use.`)
    .setRequired(true)
)

options.forEach(cat => {
  data.options[0].addChoices(cat)
})

data.addStringOption(option =>
  option
    .setName('subject')
    .setDescription('What is the subject of the image?')
    .setRequired(true)
)

data.addStringOption(option =>
  option
    .setName('style')
    .setDescription('What is the style of the image?')
    .setRequired(true)
)

data.addStringOption(option =>
  option
    .setName('background')
    .setDescription(
      'What is the background of the image? (white, transparent or creative)'
    )
    .setRequired(true)
)

data.addStringOption(option =>
  option
    .setName('count')
    .setDescription('How many variations?')
    .setRequired(true)
)

data.addStringOption(option =>
  option
    .setName('advanced')
    .setDescription(
      'Advanced customization of the prompt, see /help to learn more.'
    )
)

module.exports = {
  data: data,
  async execute(interaction) {
    const formula = interaction.options.getString('formula')
    const subject = interaction.options.getString('subject')
    const style = interaction.options.getString('style')
    const advanced = interaction.options.getString('advanced')
    const background = interaction.options.getString('background')
    const count = interaction.options.getString('count')

    if (!formula) return interaction.reply('Please provide a formula.')
    if (!subject) return interaction.reply('Please provide a subject.')
    if (!style) return interaction.reply('Please provide a style.')
    if (!background) return interaction.reply('Please provide a background.')
    if (!count) return interaction.reply('Please provide a count.')

    await interaction.deferReply()
    await interaction.editReply(
      await generate(formula, subject, style, advanced, background, count)
    )
  },
}

async function generate(formula, subject, style, prompt, background, count) {
  const selectedFormula = formulas[formula]
  const result = replacePlaceholders(selectedFormula, prompt)
  const content = result
    .replace('[subject]', `[${subject}]`)
    .replace('[style]', `[${style}]`)
    .replace('[background]', `[${background}]`)

  const conversation = [
    {
      role: 'system',
      content:
        'You a creative writer and excel at find descriptive ways to change words. You take any sentence and make variations of sentence where any word that has brackets you will find various words to use. Example, a sentence like "a photo of [cat] with [type of lighting]" could be turned into  2 variations like this: 1: "a photo of a large cat with dark lighting" 2: "a photo of a fluffy orange cat with bright contrast lighting". You only provide JSON output. Make sure to always change what is inside bracket for each variation. Always change each word, each time, not just one of them, but all of them. Only output JSON like this: {"variations": ["variation 1", "variation 2"]}',
    },
    {
      role: 'user',
      content: `I want ${count} variations of the following as JSON (never append a period at end of sentence or capitalize, keep all lower case). Only raw text JSON: "${content}"`,
    },
  ]

  const chatgpt = await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversation,
    })
    .catch(error => {
      return (
        'Sorry, ran into trouble with the OpenAI API. Error Message: ' + error
      )
    })

  try {
    const replyJSON = JSON.parse(chatgpt.data.choices[0].message.content)

    let response = 'Prompts for Midjourney:\n\n'
    for (let i = 0; i < replyJSON.variations.length; i++) {
      response += `**V${i + 1}** \`\`\`/imagine prompt: ${
        replyJSON.variations[i]
      }\`\`\`\n`
    }

    return response
  } catch (error) {
    return (
      'Sorry, ran into trouble with the OpenAI API. Error Message: ' + error
    )
  }
}

function replacePlaceholders(template, keyValueString) {
  const keyValueRegex = /\[(\w+(?:\s+\w+)*)=(\w+)\]/g
  const keyValuePairs = {}

  let keyValueMatch
  while ((keyValueMatch = keyValueRegex.exec(keyValueString)) !== null) {
    const key = keyValueMatch[1]
    const value = keyValueMatch[2]
    keyValuePairs[key] = value
  }

  const regex = /\[([^\]]+)\]/g
  const result = template.replace(regex, (match, word) => {
    return keyValuePairs[word] ? `[${keyValuePairs[word]}]` : match
  })

  return result
}
