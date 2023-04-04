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
const { formulas } = require('../../config/database.json')
const options = Object.entries(formulas).map(([key, value]) => {
  return {
    name: key,
    value: key,
  }
})

const data = new SlashCommandBuilder()
  .setName('generate-prompts')
  .setDescription(
    'Build prompts for Midjourney using your formulas with ChatGPT.'
  )

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
    .setName('aspect-ratio')
    .setDescription(
      'What is the aspect ratio? Default is 1:1. (16:9, 4:3, 1:1, 2:3, 3:4, 9:16, 3:2, 1:2, 2:1)'
    )
)

data.addStringOption(option =>
  option
    .setName('variables')
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
    const variables = interaction.options.getString('variables')
    const background = interaction.options.getString('background')
    const aspectRatio = interaction.options.getString('aspect-ratio')

    if (!formula) return interaction.reply('Please provide a formula.')
    if (!subject) return interaction.reply('Please provide a subject.')
    if (!style) return interaction.reply('Please provide a style.')
    if (!background) return interaction.reply('Please provide a background.')

    await interaction.deferReply()
    await interaction.editReply(
      await generate(
        formula,
        subject,
        style,
        variables,
        background,
        7,
        aspectRatio
      )
    )
  },
}

async function generate(
  formula,
  subject,
  style,
  variables,
  background,
  count,
  aspectRatio
) {
  const selectedFormula = formulas[formula]
  const result = replacePlaceholders(selectedFormula, variables)
  const content = result
    .replace('[subject]', `[${subject}]`)
    .replace('[style]', `[${style}]`)
    .replace('[background] background', `--bg`)

  const conversation = [
    {
      role: 'system',
      content:
        'You a creative writer and excel at ultra descriptive ways to rewrite words. You take any sentence and make variations of sentence where any word that has brackets you will find alternative descriptive words to use. Remember you MUST always leave "--bg" as is. Example, a sentence like "a photo of [cat] with [type of lighting]" could be turned into  2 variations like this: 1: "a photo of a large long haired cat with green eyes and long claws with dark, moody and low smokey lighting" 2: "a photo of a fluffy orange cat with bright contrast lighting". You only provide JSON output. Make sure to always change what is inside bracket for each variation. Only output JSON like this: {"variations": ["variation 1", "variation 2"]}',
    },
    {
      role: 'user',
      content: `I want ${count} variations of the following as JSON (never append a period at end of sentence or capitalize, keep all lower case). Please leave "--bg" as is and only return JSON:
      

      "${content}"`,
    },
  ]

  const chatgpt = await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversation,
    })
    .catch(error => {
      return (
        '🪳\nSorry, ran into trouble with the OpenAI API. Error Message: ' +
        error
      )
    })

  try {
    const replyJSON = JSON.parse(
      chatgpt.data.choices[0].message.content.replaceAll(
        '--bg',
        `${background} background`
      )
    )

    let response = 'Prompts for Midjourney:\n'
    let ar = ''

    for (let i = 0; i < replyJSON.variations.length; i++) {
      if (aspectRatio) {
        ar = ` --ar ${aspectRatio}`
      }

      response += `\n**V${i + 1}** \`\`\`/imagine prompt: ${
        replyJSON.variations[i]
      }${ar}\`\`\` `
    }

    return response
  } catch (error) {
    return (
      '🪳\nSorry, ran into trouble with the OpenAI API. Error Message: ' + error
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
