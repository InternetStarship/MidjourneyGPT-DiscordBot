/*
 *   Copyright (c) 2023 Wynter Jones
 *   All rights reserved.
 */

const parseInputString = require('../utils/parseInput')
const { Configuration, OpenAIApi } = require('openai')
const configuration = new Configuration({
  apiKey: process.env.CHATGPT_API_KEY,
})
const openai = new OpenAIApi(configuration)
const { formulas } = require('../midjourney-formulas.json')

async function generate(message) {
  await message.channel.sendTyping()

  let prompt = ''
  const content = message.content.replace('!!ask ', '')
  const parsedData = parseInputString(content)

  if (parsedData.type) {
    let formula = formulas[parsedData.type].replace(
      /\[([^\]]+)\]/g,
      (match, p1) => {
        if (parsedData[p1]) return `[${parsedData[p1]}]`
        return match
      }
    )

    if (formula) {
      prompt = `Create 8 variations of of the following:\n\n"${formula}"\n\n`
    }
  }

  const conversation = [
    {
      role: 'system',
      content:
        'You are a variation wizard. You take any sentence and make variations of sentence where any word that has brackets you will find various words to use. Example, a sentence like "a photo of [cat] with [type of lighting]" could be turned into  2 variations like this: 1: "a photo of a large cat with dark lighting" 2: "a photo of a fluffy orange cat with bright contrast lighting". You only provide JSON output. Make sure to always change what is inside bracket for each variation. Only output JSON like this: {"variations": ["variation 1", "variation 2"]}',
    },
    {
      role: 'user',
      content: prompt,
    },
  ]

  const result = await openai
    .createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversation,
    })
    .catch(error => {
      console.log(`OPENAI ERR: ${error}`)
    })

  const replyJSON = JSON.parse(result.data.choices[0].message.content)

  let response = ''
  for (let i = 0; i < replyJSON.variations.length; i++) {
    response += `\> /imagine prompt: ${replyJSON.variations[i]}\n\n`
  }
  message.reply(response)
}

module.exports = generate
